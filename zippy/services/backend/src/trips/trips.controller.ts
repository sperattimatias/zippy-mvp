import { Body, Controller, Param, Post } from '@nestjs/common';
import { CounterofferDecisionDto } from './dto/counteroffer-decision.dto';
import { CounterofferDto } from './dto/counteroffer.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { LocationDto } from './dto/location.dto';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(dto);
  }

  @Post(':tripId/accept')
  accept(@Param('tripId') tripId: string) {
    return this.tripsService.accept(tripId);
  }

  @Post(':tripId/counteroffer')
  counteroffer(@Param('tripId') tripId: string, @Body() dto: CounterofferDto) {
    return this.tripsService.counteroffer(tripId, dto);
  }

  @Post(':tripId/counteroffer/decision')
  decision(@Param('tripId') tripId: string, @Body() dto: CounterofferDecisionDto) {
    return this.tripsService.counterofferDecision(tripId, dto);
  }

  @Post(':tripId/location')
  location(@Param('tripId') tripId: string, @Body() dto: LocationDto) {
    return this.tripsService.location(tripId, dto);
  }

  @Post(':tripId/arrive')
  arrive(@Param('tripId') tripId: string) {
    return this.tripsService.arrive(tripId);
  }

  @Post(':tripId/start')
  start(@Param('tripId') tripId: string) {
    return this.tripsService.start(tripId);
  }

  @Post(':tripId/dispute')
  dispute(@Param('tripId') tripId: string, @Body('reason') reason: string) {
    return this.tripsService.dispute(tripId, reason);
  }

  @Post(':tripId/complete')
  complete(@Param('tripId') tripId: string) {
    return this.tripsService.complete(tripId);
  }
}
