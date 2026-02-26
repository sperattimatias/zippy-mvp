# 06 — Eventos Realtime (Socket.IO)

**Zippy — developer: Matias Speratti**

Namespace MVP: `/realtime`

Estados oficiales de trip: `requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`.

## Set definitivo de eventos (MVP)

### 1) `trip:offer`
- Quién emite: backend (motor de matching).
- Quién recibe: drivers cercanos elegibles.
- Payload mínimo:
```json
{ "tripId": "t1", "pickup": { "lat": -33.46, "lng": -61.48 }, "proposed_price": 2100 }
```
- Cuándo se dispara: al crear un trip en `requested` y en reintentos de matching.

### 2) `trip:driver_assigned`
- Quién emite: backend.
- Quién recibe: pasajero del trip.
- Payload mínimo:
```json
{ "tripId": "t1", "driver": { "id": "d1", "name": "Juan", "vehiclePlate": "AA123BB" } }
```
- Cuándo se dispara: cuando el driver acepta (`POST /trips/{tripId}/accept`) y el trip queda `accepted`.

### 3) `trip:status_changed`
- Quién emite: backend.
- Quién recibe: pasajero y conductor asignado.
- Payload mínimo:
```json
{ "tripId": "t1", "status": "in_progress" }
```
- Cuándo se dispara: en cada cambio de estado oficial (`requested` → `negotiating` → `accepted` → `driver_arriving` → `in_progress` → `completed` o `cancelled`/`disputed`).

### 4) `trip:driver_location`
- Quién emite: backend (a partir de `POST /trips/{tripId}/location` del driver).
- Quién recibe: pasajero del trip.
- Payload mínimo:
```json
{ "tripId": "t1", "lat": -33.4512, "lng": -61.4921, "heading": 180, "speed": 34.5, "timestamp": "2026-03-01T10:15:30Z" }
```
- Cuándo se dispara: durante `driver_arriving` e `in_progress`.

### 5) `trip:counteroffer_received`
- Quién emite: backend.
- Quién recibe: pasajero del trip.
- Payload mínimo:
```json
{ "tripId": "t1", "counteroffer_price": 2300 }
```
- Cuándo se dispara: cuando el driver envía su única contraoferta (`POST /trips/{tripId}/counteroffer`); el trip pasa a `negotiating`.

### 6) `trip:counteroffer_decision`
- Quién emite: backend.
- Quién recibe: conductor del trip.
- Payload mínimo (accept):
```json
{ "tripId": "t1", "decision": "accept", "final_price": 2300 }
```
- Payload mínimo (reject):
```json
{ "tripId": "t1", "decision": "reject", "reason": "price_not_acceptable" }
```
- Cuándo se dispara: cuando el pasajero responde la contraoferta (`POST /trips/{tripId}/counteroffer/decision`):
  - `accept` => estado `accepted`
  - `reject` => estado `cancelled`

## Reglas técnicas MVP
- Autenticación JWT al conectar socket.
- Heartbeat cada 25 segundos.
- Reintento exponencial en cliente (máximo 30 segundos entre intentos).
- Logs de conexión/desconexión con `requestId`.
