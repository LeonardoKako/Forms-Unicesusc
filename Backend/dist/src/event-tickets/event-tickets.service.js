"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventTicketsService = class EventTicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateUniqueControlCode() {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            code = `#${Math.floor(100000 + Math.random() * 900000)}`;
            const existing = await this.prisma.eventTicket.findUnique({
                where: { controlCode: code },
            });
            if (!existing) {
                isUnique = true;
            }
        }
        return code;
    }
    async create(createEventTicketDto) {
        const controlCode = await this.generateUniqueControlCode();
        const eventDate = new Date(createEventTicketDto.eventDate);
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
    async findOne(id) {
        const ticket = await this.prisma.eventTicket.findUnique({
            where: { id },
            include: {
                supportTeams: true,
            },
        });
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket com ID "${id}" não encontrado.`);
        }
        return ticket;
    }
    async update(id, updateEventTicketDto) {
        await this.findOne(id);
        const { supportTeams, ...rest } = updateEventTicketDto;
        const data = { ...rest };
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.eventTicket.delete({
            where: { id },
        });
    }
};
exports.EventTicketsService = EventTicketsService;
exports.EventTicketsService = EventTicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventTicketsService);
//# sourceMappingURL=event-tickets.service.js.map