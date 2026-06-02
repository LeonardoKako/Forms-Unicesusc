import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventTicketsService } from './event-tickets.service';
import { CreateInternalEventDto } from './dto/create-internal-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventTicketsService: EventTicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInternalEventDto: CreateInternalEventDto) {
    return this.eventTicketsService.createInternal(createInternalEventDto);
  }

  // --- Endpoints de verificação JWT ---
  // IMPORTANTE: Devem vir ANTES dos endpoints :id para evitar conflito de rotas

  @Get('verify-author')
  verifyAuthor(@Query('token') token: string) {
    return this.eventTicketsService.verifyAuthor(token);
  }

  @Get('admin-review')
  getAdminReview(@Query('token') token: string) {
    return this.eventTicketsService.getAdminReview(token);
  }

  @Post('admin-review')
  @HttpCode(HttpStatus.OK)
  submitAdminReview(@Body() body: { token: string; approved: boolean }) {
    return this.eventTicketsService.submitAdminReview(body.token, body.approved);
  }

  // --- Endpoints CRUD padrão ---

  @Get()
  findAll() {
    return this.eventTicketsService.findAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventTicketsService.findOneEvent(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventTicketsService.removeEvent(id);
  }
}
