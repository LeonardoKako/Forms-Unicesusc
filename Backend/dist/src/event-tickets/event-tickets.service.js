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
var EventTicketsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTicketsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let EventTicketsService = EventTicketsService_1 = class EventTicketsService {
    prisma;
    jwtService;
    emailService;
    logger = new common_1.Logger(EventTicketsService_1.name);
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async generateUniqueControlCode(prefix) {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            code = `#${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
            if (prefix === 'INT') {
                const existing = await this.prisma.event.findUnique({
                    where: { controlCode: code },
                });
                if (!existing)
                    isUnique = true;
            }
            else {
                const existing = await this.prisma.location.findUnique({
                    where: { controlCode: code },
                });
                if (!existing)
                    isUnique = true;
            }
        }
        return code;
    }
    validateDateTime(eventDateStr, startTimeStr, endTimeStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [year, month, day] = eventDateStr.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 15) {
            throw new common_1.BadRequestException('A reserva deve possuir no mínimo 15 dias de antecedência.');
        }
        const dayOfWeek = eventDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if (isWeekend && diffDays <= 15) {
            throw new common_1.BadRequestException('Finais de semana só podem ser agendados com antecedência superior a 15 dias.');
        }
        const toMinutes = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };
        const startMinutes = toMinutes(startTimeStr);
        const endMinutes = toMinutes(endTimeStr);
        const minAllowed = toMinutes('07:30');
        const maxAllowed = toMinutes('22:30');
        if (startMinutes < minAllowed ||
            startMinutes > maxAllowed ||
            endMinutes < minAllowed ||
            endMinutes > maxAllowed) {
            throw new common_1.BadRequestException('Os horários de agendamento devem estar contidos entre 07:30 e 22:30.');
        }
        if (endMinutes <= startMinutes) {
            throw new common_1.BadRequestException('O horário de término deve ser estritamente posterior ao horário de início.');
        }
    }
    validateInstitutionalEmail(email) {
        if (!email.endsWith('@unicesusc.edu.br')) {
            throw new common_1.BadRequestException('O e-mail do solicitante interno deve terminar estritamente com @unicesusc.edu.br.');
        }
        const username = email.split('@')[0];
        const hasThreeSequentialNumbers = /\d{3,}/.test(username);
        if (hasThreeSequentialNumbers) {
            throw new common_1.BadRequestException('O e-mail institucional não pode conter 3 ou mais números sequenciais seguidos antes do @ (ex: apoio123).');
        }
    }
    async createInternal(dto) {
        this.validateDateTime(dto.eventDate, dto.startTime, dto.endTime);
        this.validateInstitutionalEmail(dto.requesterEmail);
        if (dto.isPartnerEvent) {
            if (!dto.partnerName ||
                !dto.partnerEmail ||
                !dto.partnerPhone ||
                dto.partnerPhone.length < 10 ||
                !dto.partnerInstitution) {
                throw new common_1.BadRequestException('Revise os dados do parceiro externo, pois são obrigatórios para eventos parceiros.');
            }
        }
        else {
            dto.partnerName = undefined;
            dto.partnerEmail = undefined;
            dto.partnerPhone = undefined;
            dto.partnerInstitution = undefined;
        }
        const hasTiEquipment = dto.tiEquipment &&
            dto.tiEquipment.length > 0 &&
            dto.tiEquipment.some((item) => item !== 'nao_se_aplica');
        let finalSupportTeams = [...(dto.supportTeams || [])];
        if (hasTiEquipment && !finalSupportTeams.includes('ti')) {
            finalSupportTeams.push('ti');
        }
        if (dto.furnitureSupport.includes('outro')) {
            if (!dto.otherFurnitureDescription ||
                dto.otherFurnitureDescription.length < 3) {
                throw new common_1.BadRequestException('otherFurnitureDescription é obrigatório (mínimo 3 caracteres) quando "outro" for selecionado nos móveis.');
            }
        }
        else {
            dto.otherFurnitureDescription = undefined;
        }
        if (dto.copa.includes('outro')) {
            if (!dto.otherCopaDescription || dto.otherCopaDescription.length < 3) {
                throw new common_1.BadRequestException('otherCopaDescription é obrigatório (mínimo 3 caracteres) quando "outro" for selecionado na copa.');
            }
        }
        else {
            dto.otherCopaDescription = undefined;
        }
        if (dto.presentationMaterials.includes('google_drive_link')) {
            if (!dto.presentationDriveLink) {
                throw new common_1.BadRequestException('presentationDriveLink é obrigatório quando "google_drive_link" está em presentationMaterials.');
            }
        }
        else {
            dto.presentationDriveLink = undefined;
        }
        const hasActiveCoffeeBreak = dto.coffeeBreak && dto.coffeeBreak !== 'nao_se_aplica';
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
                throw new common_1.BadRequestException(reason);
            }
        }
        else {
            if (dto.budgetApprovalFileUrl) {
                throw new common_1.BadRequestException('Não é permitido enviar budgetApprovalFileUrl se o evento não necessita de orçamento.');
            }
            dto.budgetApprovalFileUrl = undefined;
        }
        const controlCode = await this.generateUniqueControlCode('INT');
        const { supportTeams, eventDate, ...rest } = dto;
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
        const token = this.jwtService.sign({
            eventId: event.id,
            email: event.requesterEmail,
            type: 'author_verification',
        }, { expiresIn: '30m' });
        await this.emailService.sendAuthorVerification(event, token);
        return {
            message: 'Evento registrado com sucesso! Um email de verificação foi enviado para o solicitante.',
            event: {
                id: event.id,
                controlCode: event.controlCode,
                authorVerification: event.authorVerification,
                adminVerification: event.adminVerification,
            },
        };
    }
    async verifyAuthor(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch (error) {
            try {
                const decoded = this.jwtService.decode(token);
                if (decoded?.eventId && decoded?.type === 'author_verification') {
                    await this.prisma.event.deleteMany({
                        where: {
                            id: decoded.eventId,
                            authorVerification: 'pending',
                        },
                    });
                }
            }
            catch {
            }
            throw new common_1.BadRequestException('Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido). O evento foi cancelado automaticamente.');
        }
        if (payload.type !== 'author_verification') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const event = await this.prisma.event.findUnique({
            where: { id: payload.eventId },
            include: { supportTeams: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Evento não encontrado. Pode ter sido cancelado.');
        }
        if (event.authorVerification === 'approved') {
            return {
                success: true,
                message: 'Solicitação confirmada e enviada para aprovação do administrador.',
            };
        }
        const updatedEvent = await this.prisma.event.update({
            where: { id: event.id },
            data: { authorVerification: 'approved' },
            include: { supportTeams: true },
        });
        const adminToken = this.jwtService.sign({
            eventId: event.id,
            type: 'admin_review',
        }, { expiresIn: '7d' });
        await this.emailService.sendAdminApproval(updatedEvent, adminToken);
        return {
            success: true,
            message: 'Solicitação confirmada e enviada para aprovação do administrador.',
        };
    }
    async getAdminReview(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch {
            throw new common_1.BadRequestException('Token de revisão inválido ou expirado.');
        }
        if (payload.type !== 'admin_review') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const event = await this.prisma.event.findUnique({
            where: { id: payload.eventId },
            include: { supportTeams: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Evento não encontrado.');
        }
        if (event.adminVerification !== 'pending') {
            if (event.adminVerification === 'approved') {
                throw new common_1.BadRequestException('Este evento já foi APROVADO com sucesso!');
            }
            else {
                const reasonStr = event.adminRejectionReason
                    ? `. Motivo: ${event.adminRejectionReason}`
                    : '';
                throw new common_1.BadRequestException(`Este evento já foi REJEITADO${reasonStr}`);
            }
        }
        return event;
    }
    async submitAdminReview(token, approved, reason) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch {
            throw new common_1.BadRequestException('Token de revisão inválido ou expirado.');
        }
        if (payload.type !== 'admin_review') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const event = await this.prisma.event.findUnique({
            where: { id: payload.eventId },
            include: { supportTeams: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Evento não encontrado.');
        }
        if (event.adminVerification !== 'pending') {
            if (event.adminVerification === 'approved') {
                throw new common_1.BadRequestException('Este evento já foi APROVADO com sucesso!');
            }
            else {
                const reasonStr = event.adminRejectionReason
                    ? `. Motivo: ${event.adminRejectionReason}`
                    : '';
                throw new common_1.BadRequestException(`Este evento já foi REJEITADO${reasonStr}`);
            }
        }
        if (approved) {
            const updatedEvent = await this.prisma.event.update({
                where: { id: event.id },
                data: { adminVerification: 'approved' },
                include: { supportTeams: true },
            });
            await this.emailService.sendApprovalNotification(updatedEvent);
            await this.emailService.sendSupportTeamsNotification(updatedEvent, updatedEvent.supportTeams);
            return {
                success: true,
                message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
            };
        }
        else {
            const updatedEvent = await this.prisma.event.update({
                where: { id: event.id },
                data: {
                    adminVerification: 'rejected',
                    adminRejectionReason: reason || null,
                },
                include: { supportTeams: true },
            });
            await this.emailService.sendRejectionNotification(updatedEvent, reason);
            return {
                success: true,
                message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
            };
        }
    }
    async cleanupExpiredEvents() {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const eventResult = await this.prisma.event.deleteMany({
            where: {
                authorVerification: 'pending',
                createdAt: { lt: thirtyMinutesAgo },
            },
        });
        if (eventResult.count > 0) {
            this.logger.log(`🗑️ Limpeza: ${eventResult.count} evento(s) não verificado(s) removido(s).`);
        }
        const locationResult = await this.prisma.location.deleteMany({
            where: {
                authorVerification: 'pending',
                createdAt: { lt: thirtyMinutesAgo },
            },
        });
        if (locationResult.count > 0) {
            this.logger.log(`🗑️ Limpeza: ${locationResult.count} locação(ões) não verificada(s) removida(s).`);
        }
    }
    async createExternal(dto) {
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
        const token = this.jwtService.sign({
            locationId: location.id,
            type: 'location_author_verification',
        }, { expiresIn: '30m' });
        await this.emailService.sendLocationAuthorVerification(location, token);
        return {
            message: 'Locação registrada com sucesso! Um email de verificação foi enviado para o responsável.',
            location: {
                id: location.id,
                controlCode: location.controlCode,
                authorVerification: location.authorVerification,
                adminVerification: location.adminVerification,
            },
        };
    }
    async verifyLocationAuthor(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch (error) {
            try {
                const decoded = this.jwtService.decode(token);
                if (decoded?.locationId && decoded?.type === 'location_author_verification') {
                    await this.prisma.location.deleteMany({
                        where: {
                            id: decoded.locationId,
                            authorVerification: 'pending',
                        },
                    });
                }
            }
            catch { }
            throw new common_1.BadRequestException('Token de verificação inválido ou expirado (tempo limite de 30 minutos excedido). A locação foi cancelada automaticamente.');
        }
        if (payload.type !== 'location_author_verification') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const location = await this.prisma.location.findUnique({
            where: { id: payload.locationId },
            include: { supportTeams: true },
        });
        if (!location) {
            throw new common_1.NotFoundException('Locação não encontrada. Pode ter sido cancelada.');
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
        const adminToken = this.jwtService.sign({
            locationId: location.id,
            type: 'location_admin_review',
        }, { expiresIn: '7d' });
        await this.emailService.sendLocationAdminApproval(updatedLocation, adminToken);
        return {
            success: true,
            message: 'Solicitação confirmada e enviada para aprovação do administrador.',
        };
    }
    async getLocationAdminReview(token) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch {
            throw new common_1.BadRequestException('Token de revisão inválido ou expirado.');
        }
        if (payload.type !== 'location_admin_review') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const location = await this.prisma.location.findUnique({
            where: { id: payload.locationId },
            include: { supportTeams: true },
        });
        if (!location) {
            throw new common_1.NotFoundException('Locação não encontrada.');
        }
        if (location.adminVerification !== 'pending') {
            if (location.adminVerification === 'approved') {
                throw new common_1.BadRequestException('Esta locação já foi APROVADA com sucesso!');
            }
            else {
                const reasonStr = location.adminRejectionReason
                    ? `. Motivo: ${location.adminRejectionReason}`
                    : '';
                throw new common_1.BadRequestException(`Esta locação já foi REJEITADA${reasonStr}`);
            }
        }
        return location;
    }
    async submitLocationAdminReview(token, approved, reason) {
        let payload;
        try {
            payload = this.jwtService.verify(token);
        }
        catch {
            throw new common_1.BadRequestException('Token de revisão inválido ou expirado.');
        }
        if (payload.type !== 'location_admin_review') {
            throw new common_1.BadRequestException('Tipo de token inválido.');
        }
        const location = await this.prisma.location.findUnique({
            where: { id: payload.locationId },
            include: { supportTeams: true },
        });
        if (!location) {
            throw new common_1.NotFoundException('Locação não encontrada.');
        }
        if (location.adminVerification !== 'pending') {
            if (location.adminVerification === 'approved') {
                throw new common_1.BadRequestException('Esta locação já foi APROVADA com sucesso!');
            }
            else {
                const reasonStr = location.adminRejectionReason
                    ? `. Motivo: ${location.adminRejectionReason}`
                    : '';
                throw new common_1.BadRequestException(`Esta locação já foi REJEITADA${reasonStr}`);
            }
        }
        if (approved) {
            const updatedLocation = await this.prisma.location.update({
                where: { id: location.id },
                data: { adminVerification: 'approved' },
                include: { supportTeams: true },
            });
            await this.emailService.sendLocationApprovalNotification(updatedLocation);
            await this.emailService.sendLocationSupportTeamsNotification(updatedLocation, updatedLocation.supportTeams);
            return {
                success: true,
                message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
            };
        }
        else {
            const updatedLocation = await this.prisma.location.update({
                where: { id: location.id },
                data: {
                    adminVerification: 'rejected',
                    adminRejectionReason: reason || null,
                },
                include: { supportTeams: true },
            });
            await this.emailService.sendLocationRejectionNotification(updatedLocation, reason);
            return {
                success: true,
                message: 'Decisão registrada com sucesso e solicitante notificado por e-mail.',
            };
        }
    }
    async findAllEvents() {
        return this.prisma.event.findMany({
            include: {
                supportTeams: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneEvent(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                supportTeams: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Evento com ID "${id}" não encontrado.`);
        }
        return event;
    }
    async removeEvent(id) {
        await this.findOneEvent(id);
        return this.prisma.event.delete({
            where: { id },
        });
    }
    async findAllLocations() {
        return this.prisma.location.findMany({
            include: {
                supportTeams: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneLocation(id) {
        const location = await this.prisma.location.findUnique({
            where: { id },
            include: {
                supportTeams: true,
            },
        });
        if (!location) {
            throw new common_1.NotFoundException(`Locação com ID "${id}" não encontrada.`);
        }
        return location;
    }
    async removeLocation(id) {
        await this.findOneLocation(id);
        return this.prisma.location.delete({
            where: { id },
        });
    }
};
exports.EventTicketsService = EventTicketsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventTicketsService.prototype, "cleanupExpiredEvents", null);
exports.EventTicketsService = EventTicketsService = EventTicketsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], EventTicketsService);
//# sourceMappingURL=event-tickets.service.js.map