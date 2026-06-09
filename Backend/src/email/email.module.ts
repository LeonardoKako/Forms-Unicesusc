import { Module } from '@nestjs/common';
import { EventsEmailService } from './events-email.service';
import { LocationsEmailService } from './locations-email.service';

@Module({
  providers: [EventsEmailService, LocationsEmailService],
  exports: [EventsEmailService, LocationsEmailService],
})
export class EmailModule {}
