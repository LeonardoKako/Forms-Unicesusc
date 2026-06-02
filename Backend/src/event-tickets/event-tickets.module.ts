import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { LocationsController } from './locations.controller';
import { EventTicketsService } from './event-tickets.service';

@Module({
  controllers: [EventsController, LocationsController],
  providers: [EventTicketsService],
})
export class EventTicketsModule {}
