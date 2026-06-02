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
exports.CreateInternalEventDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateInternalEventDto {
    requesterType;
    requesterName;
    requesterEmail;
    requesterPhone;
    requesterDepartment;
    isPartnerEvent;
    partnerName;
    partnerEmail;
    partnerPhone;
    partnerInstitution;
    eventTitle;
    eventType;
    eventDescription;
    targetAudience;
    estimatedPublic;
    eventDate;
    startTime;
    endTime;
    selectedRoom;
    roomNotes;
    needsBudget;
    budgetApprovalFileUrl;
    copa;
    otherCopaDescription;
    coffeeBreak;
    coffeeNotes;
    tiEquipment;
    furnitureSupport;
    otherFurnitureDescription;
    supportTeams;
    presentationMaterials;
    presentationDriveLink;
    needsArtwork;
    hasPrintedArtwork;
    artworkDescription;
}
exports.CreateInternalEventDto = CreateInternalEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['interno']),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "requesterType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'requesterName deve ter no mínimo 3 caracteres' }),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "requesterName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'requesterEmail deve ser um e-mail válido' }),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "requesterEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'requesterPhone deve ter no mínimo 10 dígitos' }),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "requesterPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'requesterDepartment deve ter no mínimo 2 caracteres',
    }),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "requesterDepartment", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateInternalEventDto.prototype, "isPartnerEvent", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "partnerName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'partnerEmail deve ser um e-mail válido' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "partnerEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "partnerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "partnerInstitution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'eventTitle deve ter no mínimo 5 caracteres' }),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "eventTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "eventDescription", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "targetAudience", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateInternalEventDto.prototype, "estimatedPublic", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "selectedRoom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "roomNotes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternalEventDto.prototype, "needsBudget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "budgetApprovalFileUrl", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "copa", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "otherCopaDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "coffeeBreak", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "coffeeNotes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "tiEquipment", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "furnitureSupport", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "otherFurnitureDescription", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "supportTeams", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInternalEventDto.prototype, "presentationMaterials", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "presentationDriveLink", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInternalEventDto.prototype, "needsArtwork", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateInternalEventDto.prototype, "hasPrintedArtwork", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", String)
], CreateInternalEventDto.prototype, "artworkDescription", void 0);
//# sourceMappingURL=create-internal-event.dto.js.map