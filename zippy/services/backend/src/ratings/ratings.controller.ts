import { ConflictException, Controller, Headers, Param, Post, Body } from '@nestjs/common';
import { requireRole } from '../common/auth-context';
import { TripsService } from '../trips/trips.service';
import { TripStatus } from '../trips/trip-status.enum';
import { RateTripDto } from './dto/rate-trip.dto';

@Controller('trips')
export class RatingsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post(':tripId/rate')
  rate(@Headers('x-role') role: string, @Param('tripId') tripId: string, @Body() dto: RateTripDto) {
    requireRole(role, ['passenger']);
    const trip = this.tripsService.getTrip(tripId);
    if (trip.status !== TripStatus.completed) throw new ConflictException('TRIP_NOT_COMPLETED');
    return { tripId, ratingId: `rt_${Date.now()}`, score: dto.score };
  }
}
