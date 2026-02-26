import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TripsGateway } from '../realtime/trips.gateway';
import { CounterofferDecisionDto } from './dto/counteroffer-decision.dto';
import { CounterofferDto } from './dto/counteroffer.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { LocationDto } from './dto/location.dto';
import { TripStatus } from './trip-status.enum';

type Trip = {
  tripId: string;
  passengerId: string;
  driverId?: string;
  status: TripStatus;
  proposed_price: number;
  counteroffer_price?: number;
  final_price?: number;
  reason?: string;
  hasCounteroffer: boolean;
};

const ACTIVE_STATUSES: TripStatus[] = [
  TripStatus.requested,
  TripStatus.negotiating,
  TripStatus.accepted,
  TripStatus.driver_arriving,
  TripStatus.in_progress,
];

@Injectable()
export class TripsService {
  private readonly trips = new Map<string, Trip>();

  constructor(private readonly gateway: TripsGateway) {}

  createTrip(passengerId: string, dto: CreateTripDto) {
    this.assertPassengerHasNoActiveTrip(passengerId);
    const trip: Trip = {
      tripId: `t${Date.now()}`,
      passengerId,
      status: TripStatus.requested,
      proposed_price: dto.proposed_price,
      hasCounteroffer: false,
    };
    this.trips.set(trip.tripId, trip);
    this.gateway.emitTripOffer({ tripId: trip.tripId, pickup: dto.origin, proposed_price: dto.proposed_price });
    this.gateway.emitStatusChanged({ tripId: trip.tripId, status: trip.status });
    return { tripId: trip.tripId, status: trip.status, proposed_price: trip.proposed_price };
  }

  accept(driverId: string, tripId: string) {
    this.assertDriverHasNoActiveTrip(driverId);
    const trip = this.findTrip(tripId);
    if (trip.status !== TripStatus.requested && trip.status !== TripStatus.negotiating) {
      throw new ConflictException('INVALID_STATUS_TRANSITION');
    }
    trip.status = TripStatus.accepted;
    trip.driverId = driverId;
    trip.final_price = trip.counteroffer_price ?? trip.proposed_price;
    this.gateway.emitDriverAssigned({ tripId, driver: { id: driverId, name: 'Driver', vehiclePlate: 'AA123BB' } });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, final_price: trip.final_price };
  }

  counteroffer(driverId: string, tripId: string, dto: CounterofferDto) {
    const trip = this.findTrip(tripId);
    if (trip.status !== TripStatus.requested) {
      throw new ConflictException('NEGOTIATION_NOT_ALLOWED');
    }
    if (trip.hasCounteroffer) {
      throw new ConflictException('COUNTEROFFER_ALREADY_SENT');
    }
    trip.driverId = driverId;
    trip.hasCounteroffer = true;
    trip.counteroffer_price = dto.counteroffer_price;
    trip.status = TripStatus.negotiating;
    this.gateway.emitCounterofferReceived({ tripId, counteroffer_price: dto.counteroffer_price });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, counteroffer_price: dto.counteroffer_price };
  }

  counterofferDecision(passengerId: string, tripId: string, dto: CounterofferDecisionDto) {
    const trip = this.findTrip(tripId);
    if (trip.passengerId !== passengerId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (trip.status !== TripStatus.negotiating) throw new ConflictException('NEGOTIATION_NOT_ACTIVE');

    if (dto.decision === 'accept') {
      trip.status = TripStatus.accepted;
      trip.final_price = trip.counteroffer_price;
      this.gateway.emitCounterofferDecision({ tripId, decision: dto.decision, final_price: trip.final_price });
      this.gateway.emitStatusChanged({ tripId, status: trip.status });
      return { tripId, status: trip.status, final_price: trip.final_price };
    }

    trip.status = TripStatus.cancelled;
    trip.reason = dto.reason ?? 'price_not_acceptable';
    this.gateway.emitCounterofferDecision({ tripId, decision: dto.decision, reason: trip.reason });
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, reason: trip.reason };
  }

  location(driverId: string, tripId: string, dto: LocationDto) {
    const trip = this.findTrip(tripId);
    if (trip.driverId !== driverId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (![TripStatus.driver_arriving, TripStatus.in_progress].includes(trip.status)) {
      throw new ConflictException('TRIP_NOT_IN_MOVEMENT');
    }
    this.gateway.emitDriverLocation({ tripId, ...dto });
    return { tripId, location_received: true };
  }

  arrive(driverId: string, tripId: string) {
    const trip = this.findTrip(tripId);
    if (trip.driverId !== driverId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (trip.status !== TripStatus.accepted) throw new ConflictException('INVALID_STATUS_TRANSITION');
    trip.status = TripStatus.driver_arriving;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  start(driverId: string, tripId: string) {
    const trip = this.findTrip(tripId);
    if (trip.driverId !== driverId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (trip.status !== TripStatus.driver_arriving) throw new ConflictException('INVALID_STATUS_TRANSITION');
    trip.status = TripStatus.in_progress;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  dispute(driverId: string, tripId: string, reason: string) {
    const trip = this.findTrip(tripId);
    if (trip.driverId !== driverId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (trip.status !== TripStatus.in_progress && trip.status !== TripStatus.completed) {
      throw new ConflictException('INVALID_STATUS_TRANSITION');
    }
    trip.status = TripStatus.disputed;
    trip.reason = reason;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status };
  }

  complete(driverId: string, tripId: string) {
    const trip = this.findTrip(tripId);
    if (trip.driverId !== driverId) throw new NotFoundException('TRIP_NOT_FOUND');
    if (trip.status !== TripStatus.in_progress) throw new ConflictException('INVALID_STATUS_TRANSITION');
    trip.status = TripStatus.completed;
    this.gateway.emitStatusChanged({ tripId, status: trip.status });
    return { tripId, status: trip.status, final_price: trip.final_price ?? trip.proposed_price };
  }

  getTrip(tripId: string): Trip {
    return this.findTrip(tripId);
  }

  private findTrip(tripId: string): Trip {
    const trip = this.trips.get(tripId);
    if (!trip) throw new NotFoundException('TRIP_NOT_FOUND');
    return trip;
  }

  private assertPassengerHasNoActiveTrip(passengerId: string) {
    const hasActive = [...this.trips.values()].some((t) => t.passengerId === passengerId && ACTIVE_STATUSES.includes(t.status));
    if (hasActive) throw new ConflictException('PASSENGER_ACTIVE_TRIP');
  }

  private assertDriverHasNoActiveTrip(driverId: string) {
    const hasActive = [...this.trips.values()].some((t) => t.driverId === driverId && ACTIVE_STATUSES.includes(t.status));
    if (hasActive) throw new ConflictException('DRIVER_ACTIVE_TRIP');
  }
}
