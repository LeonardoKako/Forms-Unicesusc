"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventTicketDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_event_ticket_dto_1 = require("./create-event-ticket.dto");
class UpdateEventTicketDto extends (0, mapped_types_1.PartialType)(create_event_ticket_dto_1.CreateEventTicketDto) {
}
exports.UpdateEventTicketDto = UpdateEventTicketDto;
//# sourceMappingURL=update-event-ticket.dto.js.map