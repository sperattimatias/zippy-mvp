import { Injectable, NotFoundException } from '@nestjs/common';
import { TripsGateway } from '../realtime/trips.gateway';
import { CounterofferDecisionDto } from './dto/counteroffer-decision.dto';
import { CounterofferDto } from './dto/counteroffer.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { LocationDto } from './dto/location.dto';
import { TripStatus } from './trip-status.enum';

type Trip = {
  tripId: string;
  status: TripStatus;
  proposed_price: number;
  final_price?: number;
  reason?: string;
};

@Injectable()
export class TripsService {
  private readonly trips = new Map<string, Trip>();

  constructor(private readonly gateway: TripsGateway) {}

  createTrip(dto: CreateTripDto) {
    const trip: Trip = { tripId: `t${Date.now()}`, status: TripStatus.requested, proposed_price: dto.proposed_price };
    this.trips.set(trip.tripId, trip);
    this.gateway.emitTripOffer({ tripId: trip.tripId, pickup: dto.origin, proposed_price: dto.proposed_price });
    return trip;
  }

  accept(tripId: string) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.accepted;
    trip.final_price = trip.proposed_price;
    this.gateway.emitDriverAssigned({ tripId, driver: { id: 'd1', name: 'Driver', vehiclePlate: 'AA123BB' } });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, final_price: trip.final_price };
  }

  counteroffer(tripId: string, dto: CounterofferDto) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.negotiating;
    this.gateway.emitCounterofferReceived({ tripId, counteroffer_price: dto.counteroffer_price });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, counteroffer_price: dto.counteroffer_price };
  }

  counterofferDecision(tripId: string, dto: CounterofferDecisionDto) {
    const trip = this.findTrip(tripId);
    if (dto.decision === 'accept') {
      trip.status = TripStatus.accepted;
      trip.final_price = trip.final_price ?? 2300;
      this.gateway.emitCounterofferDecision({ tripId, decision: dto.decision, final_price: trip.final_price });
      this.gateway.emitStatusChanged({ tripId, status: trip.status });
      return { tripId, status: trip.status, final_price: trip.final_price };
    }
    trip.status = TripStatus.cancelled;
    trip.reason = dto.reason ?? 'rejected';
    this.gateway.emitCounterofferDecision({ tripId, decision: dto.decision, reason: trip.reason });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, reason: trip.reason };
  }

  location(tripId: string, dto: LocationDto) {
    this.findTrip(tripId);
    this.gateway.emitDriverLocation({ tripId, ...dto });
    return { tripId, location_received: true };
  }


  arrive(tripId: string) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.driver_arriving;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  start(tripId: string) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.in_progress;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  dispute(tripId: string, reason: string) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.disputed;
    trip.reason = reason;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  complete(tripId: string) {
    const trip = this.findTrip(tripId);
    trip.status = TripStatus.completed;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, final_price: trip.final_price ?? trip.proposed_price };
  }

  private findTrip(tripId: string): Trip {
    const trip = this.trips.get(tripId);
    if (!trip) throw new NotFoundException('TRIP_NOT_FOUND');
    return trip;
  }
}
