import { Module } from '@nestjs/common';
import { TripsGateway } from './trips.gateway';

@Module({
  providers: [TripsGateway],
  exports: [TripsGateway],
})
export class RealtimeModule {}
