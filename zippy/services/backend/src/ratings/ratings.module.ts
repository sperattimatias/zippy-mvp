import { Module } from '@nestjs/common';
import { TripsModule } from '../trips/trips.module';
import { RatingsController } from './ratings.controller';

@Module({
  imports: [TripsModule],
  controllers: [RatingsController],
})
export class RatingsModule {}
