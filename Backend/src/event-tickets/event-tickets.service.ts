import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateInternalEventDto } from './dto/create-internal-event.dto';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';

@Injectable()
export class EventTicketsService {
  private readonly logger = new Logger(EventTicketsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // =============================================
  // UTILITÁRIOS
  // =============================================

  private async generateUniqueControlCode(
    prefix: 'INT' | 'LOC',
  ): Promise<string> {
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = `#${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

      if (prefix === 'INT') {
        const existing = await this.prisma.event.findUnique({
          where: { controlCode: code },
        });
        if (!existing) isUnique = true;
      } else {
        const existing = await this.prisma.location.findUnique({
          where: { controlCode: code },
        });
        if (!existing) isUnique = true;
      }
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

  private validateInstitutionalEmail(email: string) {
    if (!email.endsWith('@unicesusc.edu.br')) {
      throw new BadRequestException(
        'O e-mail do solicitante interno deve terminar estritamente com @unicesusc.edu.br.',
      );
    }

    const username = email.split('@')[0];
    const hasThreeSequentialNumbers = /\d{3,}/.test(username);
    if (hasThreeSequentialNumbers) {
      throw new BadRequestException(
        'O e-mail institucional não pode conter 3 ou mais números sequenciais seguidos antes do @ (ex: apoio123).',
      );
    }
  }

  // =============================================
  // CRIAÇÃO FLUXO INTERNO (EVENTS)
  // =============================================

  async createInternal(dto: CreateInternalEventDto) {
    this.validateDateTime(dto.eventDate, dto.startTime, dto.endTime);
    this.validateInstitutionalEmail(dto.requesterEmail);

    // Regra: Evento Parceiro
    if (dto.isPartnerEvent) {
      if (
        !dto.partnerName ||
        !dto.partnerEmail ||
        !dto.partnerPhone ||
        dto.partnerPhone.length < 10 ||
        !dto.partnerInstitution
      ) {
        throw new BadRequestException(
          'Revise os dados do parceiro externo, pois são obrigatórios para eventos parceiros.',
        );
      }
    } else {
      dto.partnerName = undefined;
      dto.partnerEmail = undefined;
      dto.partnerPhone = undefined;
      dto.partnerInstitution = undefined;
    }

    // TI Reativo
    const hasTiEquipment =
      dto.tiEquipment &&
      dto.tiEquipment.length > 0 &&
      dto.tiEquipment.some((item) => item !== 'nao_se_aplica');
    let finalSupportTeams = [...(dto.supportTeams || [])];
    if (hasTiEquipment && !finalSupportTeams.includes('ti')) {
      finalSupportTeams.push('ti');
    }

    // Campos "Outros" Dinâmicos
    if (dto.furnitureSupport.includes('outro')) {
      if (
        !dto.otherFurnitureDescription ||
        dto.otherFurnitureDescription.length < 3
      ) {
        throw new BadRequestException(
          'otherFurnitureDescription é obrigatório (mínimo 3 caracteres) quando "outro" for selecionado nos móveis.',
        );
      }
    } else {
      dto.otherFurnitureDescription = undefined;
    }

    if (dto.copa.includes('outro')) {
      if (!dto.otherCopaDescription || dto.otherCopaDescription.length < 3) {
        throw new BadRequestException(
          'otherCopaDescription é obrigatório (mínimo 3 caracteres) quando "outro" for selecionado na copa.',
        );
      }
    } else {
      dto.otherCopaDescription = undefined;
    }

    // Google Drive Link
    if (dto.presentationMaterials.includes('google_drive_link')) {
      if (!dto.presentationDriveLink) {
        throw new BadRequestException(
          'presentationDriveLink é obrigatório quando "google_drive_link" está em presentationMaterials.',
        );
      }
    } else {
      dto.presentationDriveLink = undefined;
    }

    // Orçamento Financeiro
    const hasActiveCoffeeBreak =
      dto.coffeeBreak && dto.coffeeBreak !== 'nao_se_aplica';
    const hasPrintedArtwork = dto.needsArtwork && dto.hasPrintedArtwork;

    let needsBudget = dto.needsBudget;
    if (hasActiveCoffeeBreak || hasPrintedArtwork) {
      needsBudget = true;
    }

    if (needsBudget) {
      if (!dto.budgetApprovalFileUrl) {
        const reason = hasActiveCoffeeBreak
          ? 'budgetApprovalFileUrl é obrigatório quando coffeeBreak é contratado (diferente de "nao_se_aplica").'
          : hasPrintedArtwork
            ? 'budgetApprovalFileUrl é obrigatório quando há peças de arte impressas (hasPrintedArtwork = true).'
            : 'budgetApprovalFileUrl é obrigatório quando o evento necessita de orçamento.';
        throw new BadRequestException(reason);
      }
    } else {
      if (dto.budgetApprovalFileUrl) {
        throw new BadRequestException(
          'Não é permitido enviar budgetApprovalFileUrl se o evento não necessita de orçamento.',
        );
      }
      dto.budgetApprovalFileUrl = undefined;
    }

    const controlCode = await this.generateUniqueControlCode('INT');

    const { supportTeams, eventDate, ...rest } = dto;

    // Salva com status pending (author + admin)
    const event = await this.prisma.event.create({
      data: {
        ...rest,
        controlCode,
        eventDate: new Date(dto.eventDate),
        needsBudget,
        authorVerification: 'pending',
        adminVerification: 'pending',
        partnerName: dto.partnerName,
        partnerEmail: dto.partnerEmail,
        partnerPhone: dto.partnerPhone,
        partnerInstitution: dto.partnerInstitution,
        otherFurnitureDescription: dto.otherFurnitureDescription,
        otherCopaDescription: dto.otherCopaDescription,
        presentationDriveLink: dto.presentationDriveLink,
        budgetApprovalFileUrl: dto.budgetApprovalFileUrl,
        supportTeams: {
          connect: finalSupportTeams.map((id) => ({ id })),
        },
      },
      include: {
        supportTeams: true,
      },
    });

    // Gera JWT para verificação do autor (30 minutos)
    const token = this.jwtService.sign(
      {
        eventId: event.id,
        email: event.requesterEmail,
        type: 'author_verification',
      },
      { expiresIn: '30m' },
    );

    // Envia email de verificação ao autor
    await this.emailService.sendAuthorVerification(event, token);

    return {
      message:
        'Evento registrado com sucesso! Um email de verificação foi enviado para o solicitante.',
      event: {
        id: event.id,
        controlCode: event.controlCode,
        authorVerification: event.authorVerification,
        adminVerification: event.adminVerification,
      },
    };
  }

  // =============================================
  // VERIFICAÇÃO DO AUTOR (Etapa 1)
  // =============================================

  async verifyAuthor(token: string) {
    let payload: { eventId: string; email: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      // Se o token expirou, tentar decodificar para pegar o eventId e deletar
      try {
        const decoded = this.jwtService.decode(token) as {
          eventId: string;
          type: string;
        };
        if (decoded?.eventId && decoded?.type === 'author_verification') {
          await this.prisma.event.deleteMany({
            where: {
              id: decoded.eventId,
              authorVerification: 'pending',
            },
          });
        }
      } catch {
        // Ignorar se não conseguir decodificar
      }
      throw new BadRequestException(
        'Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido). O evento foi cancelado automaticamente.',
      );
    }

    if (payload.type !== 'author_verification') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: payload.eventId },
      include: { supportTeams: true },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado. Pode ter sido cancelado.');
    }

    if (event.authorVerification === 'approved') {
      return {
        success: true,
        message: 'Solicitação confirmada e enviada para aprovação do administrador.',
      };
    }

    // Atualiza status do autor para aprovado
    const updatedEvent = await this.prisma.event.update({
      where: { id: event.id },
      data: { authorVerification: 'approved' },
      include: { supportTeams: true },
    });

    // Gera JWT para o admin (7 dias)
    const adminToken = this.jwtService.sign(
      {
        eventId: event.id,
        type: 'admin_review',
      },
      { expiresIn: '7d' },
    );

    // Envia email ao admin para aprovação
    await this.emailService.sendAdminApproval(updatedEvent, adminToken);

    return {
      success: true,
      message: 'Solicitação confirmada e enviada para aprovação do administrador.',
    };
  }

  // =============================================
  // REVISÃO DO ADMIN (Etapa 2)
  // =============================================

  async getAdminReview(token: string) {
    let payload: { eventId: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Token de revisão inválido ou expirado.');
    }

    if (payload.type !== 'admin_review') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: payload.eventId },
      include: { supportTeams: true },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (event.adminVerification !== 'pending') {
      if (event.adminVerification === 'approved') {
        throw new BadRequestException('Este evento já foi APROVADO com sucesso!');
      } else {
        const reasonStr = event.adminRejectionReason
          ? `. Motivo: ${event.adminRejectionReason}`
          : '';
        throw new BadRequestException(`Este evento já foi REJEITADO${reasonStr}`);
      }
    }

    return event;
  }

  async submitAdminReview(
    token: string,
    approved: boolean,
    reason?: string,
  ) {
    let payload: { eventId: string; type: string };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Token de revisão inválido ou expirado.');
    }

    if (payload.type !== 'admin_review') {
      throw new BadRequestException('Tipo de token inválido.');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: payload.eventId },
      include: { supportTeams: true },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (event.adminVerification !== 'pending') {
      if (event.adminVerification === 'approved') {
        throw new BadRequestException('Este evento já foi APROVADO com sucesso!');
      } else {
        const reasonStr = event.adminRejectionReason
          ? `. Motivo: ${event.adminRejectionReason}`
          : '';
        throw new BadRequestException(`Este evento já foi REJEITADO${reasonStr}`);
      }
    }

    if (approved) {
      // Aprovar o evento
      const updatedEvent = await this.prisma.event.update({
        where: { id: event.id },
        data: { adminVerification: 'approved' },
        include: { supportTeams: true },
      });

      // Notificar o autor sobre aprovação
      await this.emailService.sendApprovalNotification(updatedEvent);

      // Notificar as equipes de apoio selecionadas de forma unificada
      await this.emailService.sendSupportTeamsNotification(
        updatedEvent,
        updatedEvent.supportTeams,
      );

      return {
        success: true,
        message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
      };
    } else {
      // Rejeitar o evento
      const updatedEvent = await this.prisma.event.update({
        where: { id: event.id },
        data: {
          adminVerification: 'rejected',
          adminRejectionReason: reason || null,
        },
        include: { supportTeams: true },
      });

      // Notificar o autor sobre rejeição
      await this.emailService.sendRejectionNotification(updatedEvent, reason);

      return {
        success: true,
        message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
      };
    }
  }

  // =============================================
  // CRON JOB: Limpeza de eventos não verificados
  // =============================================

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredEvents() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Limpeza de Eventos Internos
    const eventResult = await this.prisma.event.deleteMany({
      where: {
        authorVerification: 'pending',
        createdAt: { lt: thirtyMinutesAgo },
      },
    });

    if (eventResult.count > 0) {
      this.logger.log(
        `🗑️ Limpeza: ${eventResult.count} evento(s) não verificado(s) removido(s).`,
      );
    }

    // Limpeza de Locações Externas
    const locationResult = await this.prisma.location.deleteMany({
      where: {
        authorVerification: 'pending',
        createdAt: { lt: thirtyMinutesAgo },
      },
    });

    if (locationResult.count > 0) {
      this.logger.log(
        `🗑️ Limpeza: ${locationResult.count} locação(ões) não verificada(s) removida(s).`,
      );
    }
  }

  // =============================================
  // CRIAÇÃO FLUXO EXTERNO (LOCATIONS)
  // =============================================

  async createExternal(dto: CreateExternalLocationDto) {
    this.validateDateTime(dto.eventDate, dto.startTime, dto.endTime);

    const controlCode = await this.generateUniqueControlCode('LOC');

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
    await this.emailService.sendLocationAuthorVerification(location, token);

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

  // =============================================
  // VERIFICAÇÃO DE LOCAÇÃO (Etapa 1)
  // =============================================

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
    await this.emailService.sendLocationAdminApproval(updatedLocation, adminToken);

    return {
      success: true,
      message: 'Solicitação confirmada e enviada para aprovação do administrador.',
    };
  }

  // =============================================
  // REVISÃO DE LOCAÇÃO PELO ADMIN (Etapa 2)
  // =============================================

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
      await this.emailService.sendLocationApprovalNotification(updatedLocation);

      // Notifica as equipes de apoio convocadas de forma unificada
      await this.emailService.sendLocationSupportTeamsNotification(
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
      await this.emailService.sendLocationRejectionNotification(updatedLocation, reason);

      return {
        success: true,
        message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
      };
    }
  }

  // =============================================
  // CONSULTAS EVENTS
  // =============================================

  async findAllEvents() {
    return this.prisma.event.findMany({
      include: {
        supportTeams: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        supportTeams: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID "${id}" não encontrado.`);
    }

    return event;
  }

  async removeEvent(id: string) {
    await this.findOneEvent(id);
    return this.prisma.event.delete({
      where: { id },
    });
  }

  // =============================================
  // CONSULTAS LOCATIONS
  // =============================================

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
