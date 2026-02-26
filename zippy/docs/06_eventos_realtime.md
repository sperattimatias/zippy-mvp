# 06 — Eventos Realtime (Socket.IO)

**Zippy — developer: Matias Speratti**

Namespace sugerido: `/realtime`

## Eventos para pasajero
- `trip:driver_assigned`
  - payload: `{ tripId, driver: { id, name, vehiclePlate, rating }, etaMinutes }`
- `trip:status_changed`
  - payload: `{ tripId, status }`
  - `status` permitido: `requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`
- `trip:driver_location`
  - payload: `{ tripId, lat, lng, heading, speed }`
- `trip:counteroffer_received`
  - payload: `{ tripId, amount, expiresAt }`
- `safety:sos_ack`
  - payload: `{ tripId, caseId, receivedAt }`

## Eventos para conductor
- `trip:offer`
  - payload: `{ tripId, pickup: { lat, lng, text }, estimatedFare, passengerOffer }`
  - nota: `trip:offer` es un **evento realtime**, no un estado de trip.
- `trip:offer_expired`
  - payload: `{ tripId }`
- `trip:counteroffer_decision`
  - payload: `{ tripId, decision, finalFare }`

## Eventos para admin
- `safety:new_report`
  - payload: `{ reportId, tripId, type, createdAt }`
- `safety:sos_triggered`
  - payload: `{ caseId, tripId, userId, lat, lng }`

## Reglas técnicas MVP
- Autenticación por JWT al conectar socket.
- Heartbeat cada 25 segundos.
- Reintento exponencial en cliente (máximo 30 segundos entre intentos).
- Logs de conexión/desconexión con `requestId`.
