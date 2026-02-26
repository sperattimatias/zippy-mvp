import { Body, Controller, Param, Post } from '@nestjs/common';
import { RateTripDto } from './dto/rate-trip.dto';

@Controller('trips')
export class RatingsController {
  @Post(':tripId/rate')
  rate(@Param('tripId') tripId: string, @Body() dto: RateTripDto) {
    return { tripId, ratingId: `rt_${Date.now()}`, score: dto.score };
  }
}
