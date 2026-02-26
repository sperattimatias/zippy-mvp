import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/realtime', cors: true })
export class TripsGateway {
  @WebSocketServer()
  server!: Server;

  emitTripOffer(payload: Record<string, unknown>) {
    this.server.emit('trip:offer', payload);
  }

  emitDriverAssigned(payload: Record<string, unknown>) {
    this.server.emit('trip:driver_assigned', payload);
  }

  emitStatusChanged(payload: Record<string, unknown>) {
    this.server.emit('trip:status_changed', payload);
  }

  emitDriverLocation(payload: Record<string, unknown>) {
    this.server.emit('trip:driver_location', payload);
  }

  emitCounterofferReceived(payload: Record<string, unknown>) {
    this.server.emit('trip:counteroffer_received', payload);
  }

  emitCounterofferDecision(payload: Record<string, unknown>) {
    this.server.emit('trip:counteroffer_decision', payload);
  }
}
