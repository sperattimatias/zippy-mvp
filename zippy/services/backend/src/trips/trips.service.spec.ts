import { ConflictException } from '@nestjs/common';
import { TripsGateway } from '../realtime/trips.gateway';
import { TripStatus } from './trip-status.enum';
import { TripsService } from './trips.service';

class GatewayMock {
  emitTripOffer() {}
  emitDriverAssigned() {}
  emitStatusChanged() {}
  emitDriverLocation() {}
  emitCounterofferReceived() {}
  emitCounterofferDecision() {}
}

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(() => {
    service = new TripsService(new GatewayMock() as unknown as TripsGateway);
  });

  it('create trip', () => {
    const trip = service.createTrip('p1', { origin: { lat: 1, lng: 1 }, destination: { lat: 2, lng: 2 }, proposed_price: 1000 });
    expect(trip.status).toBe(TripStatus.requested);
  });

  it('accept trip', () => {
    const trip = service.createTrip('p1', { origin: { lat: 1, lng: 1 }, destination: { lat: 2, lng: 2 }, proposed_price: 1000 });
    const accepted = service.accept('d1', trip.tripId);
    expect(accepted.status).toBe(TripStatus.accepted);
  });

  it('counteroffer only once', () => {
    const trip = service.createTrip('p1', { origin: { lat: 1, lng: 1 }, destination: { lat: 2, lng: 2 }, proposed_price: 1000 });
    service.counteroffer('d1', trip.tripId, { counteroffer_price: 1100 });
    expect(() => service.counteroffer('d1', trip.tripId, { counteroffer_price: 1200 })).toThrow(ConflictException);
  });

  it('start and complete transitions', () => {
    const trip = service.createTrip('p1', { origin: { lat: 1, lng: 1 }, destination: { lat: 2, lng: 2 }, proposed_price: 1000 });
    service.accept('d1', trip.tripId);
    expect(() => service.start('d1', trip.tripId)).toThrow(ConflictException);
    service.arrive('d1', trip.tripId);
    expect(service.start('d1', trip.tripId).status).toBe(TripStatus.in_progress);
    expect(service.complete('d1', trip.tripId).status).toBe(TripStatus.completed);
  });
});
