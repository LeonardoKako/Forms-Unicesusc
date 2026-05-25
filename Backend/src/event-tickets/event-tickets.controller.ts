import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventTicketsService } from './event-tickets.service';
import { CreateEventTicketDto } from './dto/create-event-ticket.dto';
import { UpdateEventTicketDto } from './dto/update-event-ticket.dto';

@Controller('event-tickets')
export class EventTicketsController {
  constructor(private readonly eventTicketsService: EventTicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventTicketDto: CreateEventTicketDto) {
    return this.eventTicketsService.create(createEventTicketDto);
  }

  @Get()
  findAll() {
    return this.eventTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventTicketsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventTicketDto: UpdateEventTicketDto,
  ) {
    return this.eventTicketsService.update(id, updateEventTicketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventTicketsService.remove(id);
  }
}
