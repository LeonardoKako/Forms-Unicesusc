import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventTicketDto } from './dto/create-event-ticket.dto';
import { UpdateEventTicketDto } from './dto/update-event-ticket.dto';

@Injectable()
export class EventTicketsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueControlCode(): Promise<string> {
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = `#${Math.floor(100000 + Math.random() * 900000)}`; // Ex: #482910
      const existing = await this.prisma.eventTicket.findUnique({
        where: { controlCode: code },
      });
      if (!existing) {
        isUnique = true;
      }
    }
    return code;
  }

  private validateAndSanitizeTicketData(dto: any, isUpdate = false, existingTicket?: any) {
    // 1. Mescla os dados atuais do banco com os novos inputs para validar dependências condicionais
    const merged = isUpdate && existingTicket ? { ...existingTicket, ...dto } : dto;

    // Regra 1: requesterType
    if (merged.requesterType === 'locacao') {
      if (!merged.adminApprovalFileUrl) {
        throw new BadRequestException('adminApprovalFileUrl é obrigatório quando requesterType é "locacao".');
      }
      dto.requesterDepartment = null;
    } else if (merged.requesterType === 'interno') {
      if (!merged.requesterDepartment) {
        throw new BadRequestException('requesterDepartment é obrigatório quando requesterType é "interno".');
      }
      dto.adminApprovalFileUrl = null;
    }

    // Regra 2: isPartnerEvent
    if (merged.isPartnerEvent) {
      if (!merged.partnerName || !merged.partnerEmail || !merged.partnerPhone || !merged.partnerInstitution) {
        throw new BadRequestException('Nome, email, telefone e instituição do parceiro são obrigatórios quando isPartnerEvent é verdadeiro.');
      }
    } else {
      dto.partnerName = null;
      dto.partnerEmail = null;
      dto.partnerPhone = null;
      dto.partnerInstitution = null;
    }

    // Regra 3: needsArtwork
    if (merged.needsArtwork) {
      if (!merged.artworkDescription) {
        throw new BadRequestException('artworkDescription é obrigatório quando needsArtwork é verdadeiro.');
      }
    } else {
      dto.artworkDescription = null;
    }

    // Regra 5: presentationMaterials & presentationDriveLink
    const hasGoogleDriveLink = merged.presentationMaterials?.includes('google_drive_link');
    if (hasGoogleDriveLink) {
      if (!merged.presentationDriveLink) {
        throw new BadRequestException('presentationDriveLink é obrigatório quando "google_drive_link" está selecionado em presentationMaterials.');
      }
    } else {
      dto.presentationDriveLink = null;
    }

    // Regra 6: coffeeBreak & budgetApprovalFileUrl
    const hasActiveCoffeeBreak = merged.coffeeBreak && merged.coffeeBreak.length > 0 && merged.coffeeBreak.some((item: string) => item !== 'nao_se_aplica');

    // Se houver coffee break ativo, força a necessidade de orçamento (needsBudget = true)
    if (hasActiveCoffeeBreak) {
      dto.needsBudget = true;
      merged.needsBudget = true;
    }

    // Regra 4: needsBudget e vice-versa
    if (merged.needsBudget) {
      if (!merged.budgetApprovalFileUrl) {
        const reason = hasActiveCoffeeBreak
          ? 'budgetApprovalFileUrl é obrigatório quando há itens de coffee break selecionados (diferentes de "nao_se_aplica").'
          : 'budgetApprovalFileUrl é obrigatório quando needsBudget é verdadeiro.';
        throw new BadRequestException(reason);
      }
    } else {
      if (merged.budgetApprovalFileUrl) {
        throw new BadRequestException('Não é permitido enviar budgetApprovalFileUrl quando o evento não necessita de orçamento (needsBudget é falso).');
      }
      dto.budgetApprovalFileUrl = null;
    }
  }

  async create(createEventTicketDto: CreateEventTicketDto) {
    // Valida e higieniza os dados do DTO baseado nas regras de negócio condicionais
    this.validateAndSanitizeTicketData(createEventTicketDto, false);

    const controlCode = await this.generateUniqueControlCode();
    
    // Converte a data do formato string ISO para objeto Date do JS/Prisma
    const eventDate = new Date(createEventTicketDto.eventDate);

    // Separa supportTeams para conectar no relacionamento N:M
    const { supportTeams, ...rest } = createEventTicketDto;

    return this.prisma.eventTicket.create({
      data: {
        ...rest,
        controlCode,
        eventDate,
        supportTeams: supportTeams && supportTeams.length > 0
          ? { connect: supportTeams.map(id => ({ id })) }
          : undefined,
      },
      include: {
        supportTeams: true,
      },
    });
  }

  async findAll() {
    return this.prisma.eventTicket.findMany({
      include: {
        supportTeams: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.eventTicket.findUnique({
      where: { id },
      include: {
        supportTeams: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket com ID "${id}" não encontrado.`);
    }

    return ticket;
  }

  async update(id: string, updateEventTicketDto: UpdateEventTicketDto) {
    // Garante que o ticket existe antes de atualizar e carrega seus dados atuais
    const existing = await this.findOne(id);

    // Valida e higieniza os dados com base na fusão das alterações com o registro existente
    this.validateAndSanitizeTicketData(updateEventTicketDto, true, existing);

    const { supportTeams, ...rest } = updateEventTicketDto;

    const data: any = { ...rest };
    
    if (updateEventTicketDto.eventDate) {
      data.eventDate = new Date(updateEventTicketDto.eventDate);
    }

    if (supportTeams) {
      data.supportTeams = {
        set: supportTeams.map(id => ({ id })),
      };
    }

    return this.prisma.eventTicket.update({
      where: { id },
      data,
      include: {
        supportTeams: true,
      },
    });
  }

  async remove(id: string) {
    // Garante que o ticket existe antes de deletar
    await this.findOne(id);

    return this.prisma.eventTicket.delete({
      where: { id },
    });
  }
}
