import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsEmailService } from '../email/locations-email.service';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly locationsEmailService: LocationsEmailService,
  ) {}

  private async generateUniqueControlCode(): Promise<string> {
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = `#LOC-${Math.floor(100000 + Math.random() * 900000)}`;
      const existing = await this.prisma.location.findUnique({
        where: { controlCode: code },
      });
      if (!existing) isUnique = true;
    }
    return code;
  }

  private validateDateTime(
    eventDateStr: string,
    startTimeStr: string,
    endTimeStr: string,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = eventDateStr.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 15) {
      throw new BadRequestException(
        'A reserva deve possuir no mínimo 15 dias de antecedência.',
      );
    }

    const dayOfWeek = eventDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend && diffDays <= 15) {
      throw new BadRequestException(
        'Finais de semana só podem ser agendados com antecedência superior a 15 dias.',
      );
    }

    const toMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = toMinutes(startTimeStr);
    const endMinutes = toMinutes(endTimeStr);
    const minAllowed = toMinutes('07:30');
    const maxAllowed = toMinutes('22:30');

    if (
      startMinutes < minAllowed ||
      startMinutes > maxAllowed ||
      endMinutes < minAllowed ||
      endMinutes > maxAllowed
    ) {
      throw new BadRequestException(
        'Os horários de agendamento devem estar contidos entre 07:30 e 22:30.',
      );
    }

    if (endMinutes <= startMinutes) {
      throw new BadRequestException(
        'O horário de término deve ser estritamente posterior ao horário de início.',
      );
    }
  }

  async createExternal(dto: CreateExternalLocationDto) {
    this.validateDateTime(dto.eventDate, dto.startTime, dto.endTime);

    const controlCode = await this.generateUniqueControlCode();

    const { supportTeams, eventDate, ...rest } = dto;

    const location = await this.prisma.location.create({
      data: {
        ...rest,
        controlCode,
        eventDate: new Date(dto.eventDate),
        authorVerification: 'pending',
        adminVerification: 'pending',
        supportTeams: {
          connect: supportTeams.map((id) => ({ id })),
        },
      },
      include: {
        supportTeams: true,
      },
    });

    // Gera token JWT para a etapa 1 da locação (30 minutos)
    const token = this.jwtService.sign(
      {
        locationId: location.id,
        type: 'location_author_verification',
      },
      { expiresIn: '30m' },
    );

    // Envia o e-mail para o verificador fixado
    await this.locationsEmailService.sendLocationAuthorVerification(location, token);

    return {
      message:
        'Locação registrada com sucesso! Um email de verificação foi enviado para o responsável.',
      location: {
        id: location.id,
        controlCode: location.controlCode,
        authorVerification: location.authorVerification,
        adminVerification: location.adminVerification,
      },
    };
  }

  async verifyLocationAuthor(token: string) {
    let payload: { locationId: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      try {
        const decoded = this.jwtService.decode(token) as {
          locationId: string;
          type: string;
        };
        if (decoded?.locationId && decoded?.type === 'location_author_verification') {
          await this.prisma.location.deleteMany({
            where: {
              id: decoded.locationId,
              authorVerification: 'pending',
            },
          });
        }
      } catch {}
      throw new BadRequestException(
        'Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido). A locação foi cancelada automaticamente.',
      );
    }

    if (payload.type !== 'location_author_verification') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const location = await this.prisma.location.findUnique({
      where: { id: payload.locationId },
      include: { supportTeams: true },
    });

    if (!location) {
      throw new NotFoundException('Locação não encontrada. Pode ter sido cancelada.');
    }

    if (location.authorVerification === 'approved') {
      return {
        success: true,
        message: 'Solicitação confirmada e enviada para aprovação do administrador.',
      };
    }

    const updatedLocation = await this.prisma.location.update({
      where: { id: location.id },
      data: { authorVerification: 'approved' },
      include: { supportTeams: true },
    });

    // Gera token JWT de aprovação do admin (7 dias)
    const adminToken = this.jwtService.sign(
      {
        locationId: location.id,
        type: 'location_admin_review',
      },
      { expiresIn: '7d' },
    );

    // Envia o e-mail de aprovação para o admin
    await this.locationsEmailService.sendLocationAdminApproval(updatedLocation, adminToken);

    return {
      success: true,
      message: 'Solicitação confirmada e enviada para aprovação do administrador.',
    };
  }

  async getLocationAdminReview(token: string) {
    let payload: { locationId: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Token de revisão inválido ou expirado.');
    }

    if (payload.type !== 'location_admin_review') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const location = await this.prisma.location.findUnique({
      where: { id: payload.locationId },
      include: { supportTeams: true },
    });

    if (!location) {
      throw new NotFoundException('Locação não encontrada.');
    }

    if (location.adminVerification !== 'pending') {
      if (location.adminVerification === 'approved') {
        throw new BadRequestException('Esta locação já foi APROVADA com sucesso!');
      } else {
        const reasonStr = location.adminRejectionReason
          ? `. Motivo: ${location.adminRejectionReason}`
          : '';
        throw new BadRequestException(`Esta locação já foi REJEITADA${reasonStr}`);
      }
    }

    return location;
  }

  async submitLocationAdminReview(
    token: string,
    approved: boolean,
    reason?: string,
  ) {
    let payload: { locationId: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Token de revisão inválido ou expirado.');
    }

    if (payload.type !== 'location_admin_review') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const location = await this.prisma.location.findUnique({
      where: { id: payload.locationId },
      include: { supportTeams: true },
    });

    if (!location) {
      throw new NotFoundException('Locação não encontrada.');
    }

    if (location.adminVerification !== 'pending') {
      if (location.adminVerification === 'approved') {
        throw new BadRequestException('Esta locação já foi APROVADA com sucesso!');
      } else {
        const reasonStr = location.adminRejectionReason
          ? `. Motivo: ${location.adminRejectionReason}`
          : '';
        throw new BadRequestException(`Esta locação já foi REJEITADA${reasonStr}`);
      }
    }

    if (approved) {
      const updatedLocation = await this.prisma.location.update({
        where: { id: location.id },
        data: { adminVerification: 'approved' },
        include: { supportTeams: true },
      });

      // Notifica o cliente externo da aprovação
      await this.locationsEmailService.sendLocationApprovalNotification(updatedLocation);

      // Notifica as equipes de apoio convocadas de forma unificada
      await this.locationsEmailService.sendLocationSupportTeamsNotification(
        updatedLocation,
        updatedLocation.supportTeams,
      );

      return {
        success: true,
        message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
      };
    } else {
      const updatedLocation = await this.prisma.location.update({
        where: { id: location.id },
        data: {
          adminVerification: 'rejected',
          adminRejectionReason: reason || null,
        },
        include: { supportTeams: true },
      });

      // Notifica o cliente externo da rejeição com motivo
      await this.locationsEmailService.sendLocationRejectionNotification(updatedLocation, reason);

      return {
        success: true,
        message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
      };
    }
  }

  async findAllLocations() {
    return this.prisma.location.findMany({
      include: {
        supportTeams: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneLocation(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        supportTeams: true,
      },
    });

    if (!location) {
      throw new NotFoundException(`Locação com ID "${id}" não encontrada.`);
    }

    return location;
  }

  async removeLocation(id: string) {
    await this.findOneLocation(id);
    return this.prisma.location.delete({
      where: { id },
    });
  }
}
