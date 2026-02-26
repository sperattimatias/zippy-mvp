# 05 — API Contract (MVP)

**Zippy — developer: Matias Speratti**

Base URL: `/api/v1`

Regla de naming: usar siempre `trips` en endpoints, payloads y eventos relacionados a viajes.

## Auth
### POST `/auth/login`
Request:
```json
{ "phone": "+5493465XXXXXX", "otp": "123456" }
```
Response 200:
```json
{ "accessToken": "jwt", "user": { "id": "u1", "role": "passenger" } }
```

## Trips
### POST `/trips` (passenger crea trip con propuesta)
Request:
```json
{ "origin": { "lat": -33.46, "lng": -61.48 }, "destination": { "lat": -33.44, "lng": -61.50 }, "proposed_price": 2100 }
```
Response 201:
```json
{ "tripId": "t1", "status": "requested", "proposed_price": 2100 }
```

### POST `/trips/{tripId}/accept` (driver)
Response 200:
```json
{ "tripId": "t1", "status": "accepted", "final_price": 2100 }
```

### POST `/trips/{tripId}/counteroffer` (driver: solo 1)
Request:
```json
{ "counteroffer_price": 2300 }
```
Response 200:
```json
{ "tripId": "t1", "status": "negotiating", "counteroffer_price": 2300 }
```
Errores:
- `409 COUNTEROFFER_ALREADY_SENT`
- `409 NEGOTIATION_NOT_ALLOWED`

### POST `/trips/{tripId}/counteroffer/decision` (passenger)
Request (aceptar):
```json
{ "decision": "accept" }
```
Response 200:
```json
{ "tripId": "t1", "status": "accepted", "final_price": 2300 }
```

Request (rechazar):
```json
{ "decision": "reject", "reason": "price_not_acceptable" }
```
Response 200:
```json
{ "tripId": "t1", "status": "cancelled", "reason": "price_not_acceptable" }
```

### POST `/trips/{tripId}/arrive` (driver)
Response 200:
```json
{ "tripId": "t1", "status": "driver_arriving" }
```

### POST `/trips/{tripId}/start` (driver)
Response 200:
```json
{ "tripId": "t1", "status": "in_progress" }
```

### POST `/trips/{tripId}/complete` (driver)
Response 200:
```json
{ "tripId": "t1", "status": "completed" }
```

### POST `/trips/{tripId}/dispute` (passenger|driver)
Request:
```json
{ "reason": "fare_disagreement" }
```
Response 202:
```json
{ "tripId": "t1", "status": "disputed" }
```

## Safety
### POST `/safety/sos`
Request:
```json
{ "tripId": "t1", "lat": -33.45, "lng": -61.49 }
```
Response 202:
```json
{ "status": "received", "caseId": "sos_1" }
```

## Formato de error estándar
```json
{
  "error": {
    "code": "TRIP_NOT_AVAILABLE",
    "message": "El viaje ya no está disponible",
    "requestId": "req-123"
  }
}
```
