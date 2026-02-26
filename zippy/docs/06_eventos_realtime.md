# 06 — Eventos Realtime (Socket.IO)

**Zippy — developer: Matias Speratti**

Namespace sugerido: `/realtime`

## Estados oficiales de trip en eventos
`requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`

## Eventos para pasajero
- `trip:status_changed`
  - payload: `{ tripId, status }`
- `trip:counteroffer_received`
  - payload: `{ tripId, counteroffer_price, expires_at }`
  - efecto esperado: el trip queda en `status: negotiating`
- `trip:driver_assigned`
  - payload: `{ tripId, driver: { id, name, vehiclePlate }, etaMinutes }`
- `trip:driver_location`
  - payload: `{ tripId, lat, lng }`

## Eventos para conductor
- `trip:offer`
  - payload: `{ tripId, pickup: { lat, lng }, proposed_price }`
  - nota: `trip:offer` es un **evento realtime**, no un estado.
- `trip:counteroffer_decision`
  - payload: `{ tripId, decision, final_price | reason }`

## Eventos para admin
- `safety:new_report`
  - payload: `{ reportId, tripId, type, createdAt }`
- `safety:sos_triggered`
  - payload: `{ caseId, tripId, userId, lat, lng }`

## Flujo de negociación (evento a evento)
1. Passenger crea trip con `proposed_price`.
2. Driver acepta o emite **1** contraoferta.
3. Si hay contraoferta, backend emite `trip:counteroffer_received` al passenger y `status_changed` a `negotiating`.
4. Passenger responde:
   - `accept` => `status_changed` a `accepted` y `final_price` definido.
   - `reject` => `status_changed` a `cancelled` con `reason`.

## Reglas técnicas MVP
- Autenticación por JWT al conectar socket.
- Heartbeat cada 25 segundos.
- Reintento exponencial en cliente (máximo 30 segundos entre intentos).
- Logs de conexión/desconexión con `requestId`.
