import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
