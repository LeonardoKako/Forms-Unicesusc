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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTicketsController = void 0;
const common_1 = require("@nestjs/common");
const event_tickets_service_1 = require("./event-tickets.service");
const create_event_ticket_dto_1 = require("./dto/create-event-ticket.dto");
const update_event_ticket_dto_1 = require("./dto/update-event-ticket.dto");
let EventTicketsController = class EventTicketsController {
    eventTicketsService;
    constructor(eventTicketsService) {
        this.eventTicketsService = eventTicketsService;
    }
    create(createEventTicketDto) {
        return this.eventTicketsService.create(createEventTicketDto);
    }
    findAll() {
        return this.eventTicketsService.findAll();
    }
    findOne(id) {
        return this.eventTicketsService.findOne(id);
    }
    update(id, updateEventTicketDto) {
        return this.eventTicketsService.update(id, updateEventTicketDto);
    }
    remove(id) {
        return this.eventTicketsService.remove(id);
    }
};
exports.EventTicketsController = EventTicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_ticket_dto_1.CreateEventTicketDto]),
    __metadata("design:returntype", void 0)
], EventTicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventTicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventTicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_ticket_dto_1.UpdateEventTicketDto]),
    __metadata("design:returntype", void 0)
], EventTicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventTicketsController.prototype, "remove", null);
exports.EventTicketsController = EventTicketsController = __decorate([
    (0, common_1.Controller)('event-tickets'),
    __metadata("design:paramtypes", [event_tickets_service_1.EventTicketsService])
], EventTicketsController);
//# sourceMappingURL=event-tickets.controller.js.map