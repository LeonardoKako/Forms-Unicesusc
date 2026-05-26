import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createEventTicketDto: CreateEventTicketDto) {
    const controlCode = await this.generateUniqueControlCode();
    
    // Converte a data do formato string ISO para objeto Date do JS/Prisma
    const eventDate = new Date(createEventTicketDto.eventDate);

    // Separa supportTeams para connectar no relacionamento N:M
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
    // Garante que o ticket existe antes de atualizar
    await this.findOne(id);

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
