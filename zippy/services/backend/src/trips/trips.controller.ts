import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { requireRole } from '../common/auth-context';
import { CounterofferDecisionDto } from './dto/counteroffer-decision.dto';
import { CounterofferDto } from './dto/counteroffer.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { LocationDto } from './dto/location.dto';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Headers('x-role') role: string, @Headers('x-user-id') userId: string, @Body() dto: CreateTripDto) {
    requireRole(role, ['passenger']);
    return this.tripsService.createTrip(userId, dto);
  }

  @Post(':tripId/accept')
  accept(@Headers('x-role') role: string, @Headers('x-user-id') userId: string, @Param('tripId') tripId: string) {
    requireRole(role, ['driver']);
    return this.tripsService.accept(userId, tripId);
  }

  @Post(':tripId/counteroffer')
  counteroffer(
    @Headers('x-role') role: string,
    @Headers('x-user-id') userId: string,
    @Param('tripId') tripId: string,
    @Body() dto: CounterofferDto,
  ) {
    requireRole(role, ['driver']);
    return this.tripsService.counteroffer(userId, tripId, dto);
  }

  @Post(':tripId/counteroffer/decision')
  decision(
    @Headers('x-role') role: string,
    @Headers('x-user-id') userId: string,
    @Param('tripId') tripId: string,
    @Body() dto: CounterofferDecisionDto,
  ) {
    requireRole(role, ['passenger']);
    return this.tripsService.counterofferDecision(userId, tripId, dto);
  }

  @Post(':tripId/location')
  location(
    @Headers('x-role') role: string,
    @Headers('x-user-id') userId: string,
    @Param('tripId') tripId: string,
    @Body() dto: LocationDto,
  ) {
    requireRole(role, ['driver']);
    return this.tripsService.location(userId, tripId, dto);
  }

  @Post(':tripId/arrive')
  arrive(@Headers('x-role') role: string, @Headers('x-user-id') userId: string, @Param('tripId') tripId: string) {
    requireRole(role, ['driver']);
    return this.tripsService.arrive(userId, tripId);
  }

  @Post(':tripId/start')
  start(@Headers('x-role') role: string, @Headers('x-user-id') userId: string, @Param('tripId') tripId: string) {
    requireRole(role, ['driver']);
    return this.tripsService.start(userId, tripId);
  }

  @Post(':tripId/dispute')
  dispute(
    @Headers('x-role') role: string,
    @Headers('x-user-id') userId: string,
    @Param('tripId') tripId: string,
    @Body('reason') reason: string,
  ) {
    requireRole(role, ['driver']);
    return this.tripsService.dispute(userId, tripId, reason);
  }

  @Post(':tripId/complete')
  complete(@Headers('x-role') role: string, @Headers('x-user-id') userId: string, @Param('tripId') tripId: string) {
    requireRole(role, ['driver']);
    return this.tripsService.complete(userId, tripId);
  }
}
