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
import { CreateExternalLocationDto } from './dto/create-external-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly eventTicketsService: EventTicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExternalLocationDto: CreateExternalLocationDto) {
    return this.eventTicketsService.createExternal(createExternalLocationDto);
  }

  @Get()
  findAll() {
    return this.eventTicketsService.findAllLocations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventTicketsService.findOneLocation(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventTicketsService.removeLocation(id);
  }
}
