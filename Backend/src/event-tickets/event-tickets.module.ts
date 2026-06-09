import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { LocationsController } from './locations.controller';
import { EventTicketsService } from './event-tickets.service';
import { LocationsService } from './locations.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [EventsController, LocationsController],
  providers: [EventTicketsService, LocationsService],
})
export class EventTicketsModule {}
