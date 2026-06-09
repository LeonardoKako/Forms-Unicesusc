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
var LocationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const locations_email_service_1 = require("../email/locations-email.service");
let LocationsService = LocationsService_1 = class LocationsService {
    prisma;
    jwtService;
    locationsEmailService;
    logger = new common_1.Logger(LocationsService_1.name);
    constructor(prisma, jwtService, locationsEmailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.locationsEmailService = locationsEmailService;
    }
    async generateUniqueControlCode() {
        let code = '';
        let isUnique = false;
        while (!isUnique) {
            code = `#LOC-${Math.floor(100000 + Math.random() * 900000)}`;
            const existing = await this.prisma.location.findUnique({
                where: { controlCode: code },
            });
            if (!existing)
                isUnique = true;
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
    async createExternal(dto) {
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
        const token = this.jwtService.sign({
            locationId: location.id,
            type: 'location_author_verification',
        }, { expiresIn: '30m' });
        await this.locationsEmailService.sendLocationAuthorVerification(location, token);
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
        await this.locationsEmailService.sendLocationAdminApproval(updatedLocation, adminToken);
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
            await this.locationsEmailService.sendLocationApprovalNotification(updatedLocation);
            await this.locationsEmailService.sendLocationSupportTeamsNotification(updatedLocation, updatedLocation.supportTeams);
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
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = LocationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        locations_email_service_1.LocationsEmailService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map