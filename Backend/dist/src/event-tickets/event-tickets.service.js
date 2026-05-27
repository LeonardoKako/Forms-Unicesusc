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
    validateAndSanitizeTicketData(dto, isUpdate = false, existingTicket) {
        const merged = isUpdate && existingTicket ? { ...existingTicket, ...dto } : dto;
        if (merged.requesterType === 'locacao') {
            if (!merged.adminApprovalFileUrl) {
                throw new common_1.BadRequestException('adminApprovalFileUrl é obrigatório quando requesterType é "locacao".');
            }
            dto.requesterDepartment = null;
        }
        else if (merged.requesterType === 'interno') {
            if (!merged.requesterDepartment) {
                throw new common_1.BadRequestException('requesterDepartment é obrigatório quando requesterType é "interno".');
            }
            dto.adminApprovalFileUrl = null;
        }
        if (merged.isPartnerEvent) {
            if (!merged.partnerName || !merged.partnerEmail || !merged.partnerPhone || !merged.partnerInstitution) {
                throw new common_1.BadRequestException('Nome, email, telefone e instituição do parceiro são obrigatórios quando isPartnerEvent é verdadeiro.');
            }
        }
        else {
            dto.partnerName = null;
            dto.partnerEmail = null;
            dto.partnerPhone = null;
            dto.partnerInstitution = null;
        }
        if (merged.needsArtwork) {
            if (!merged.artworkDescription) {
                throw new common_1.BadRequestException('artworkDescription é obrigatório quando needsArtwork é verdadeiro.');
            }
        }
        else {
            dto.artworkDescription = null;
        }
        const hasGoogleDriveLink = merged.presentationMaterials?.includes('google_drive_link');
        if (hasGoogleDriveLink) {
            if (!merged.presentationDriveLink) {
                throw new common_1.BadRequestException('presentationDriveLink é obrigatório quando "google_drive_link" está selecionado em presentationMaterials.');
            }
        }
        else {
            dto.presentationDriveLink = null;
        }
        const hasActiveCoffeeBreak = merged.coffeeBreak && merged.coffeeBreak.length > 0 && merged.coffeeBreak.some((item) => item !== 'nao_se_aplica');
        if (hasActiveCoffeeBreak) {
            dto.needsBudget = true;
            merged.needsBudget = true;
        }
        if (merged.needsBudget) {
            if (!merged.budgetApprovalFileUrl) {
                const reason = hasActiveCoffeeBreak
                    ? 'budgetApprovalFileUrl é obrigatório quando há itens de coffee break selecionados (diferentes de "nao_se_aplica").'
                    : 'budgetApprovalFileUrl é obrigatório quando needsBudget é verdadeiro.';
                throw new common_1.BadRequestException(reason);
            }
        }
        else {
            if (merged.budgetApprovalFileUrl) {
                throw new common_1.BadRequestException('Não é permitido enviar budgetApprovalFileUrl quando o evento não necessita de orçamento (needsBudget é falso).');
            }
            dto.budgetApprovalFileUrl = null;
        }
    }
    async create(createEventTicketDto) {
        this.validateAndSanitizeTicketData(createEventTicketDto, false);
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
        const existing = await this.findOne(id);
        this.validateAndSanitizeTicketData(updateEventTicketDto, true, existing);
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