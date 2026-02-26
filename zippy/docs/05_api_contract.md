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
Permisos: `passenger` ✅ | `driver` ❌ | `admin` ❌
Request:
```json
{ "origin": { "lat": -33.46, "lng": -61.48 }, "destination": { "lat": -33.44, "lng": -61.50 }, "proposed_price": 2100 }
```
Response 201:
```json
{ "tripId": "t1", "status": "requested", "proposed_price": 2100 }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `409 PASSENGER_ACTIVE_TRIP`

### POST `/trips/{tripId}/accept` (driver)
Permisos: `passenger` ❌ | `driver` ✅ | `admin` ❌
Request:
```json
{}
```
Response 200:
```json
{ "tripId": "t1", "status": "accepted", "final_price": 2100 }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 TRIP_NOT_AVAILABLE`

### POST `/trips/{tripId}/counteroffer` (driver: solo 1)
Permisos: `passenger` ❌ | `driver` ✅ | `admin` ❌
Request:
```json
{ "counteroffer_price": 2300 }
```
Response 200:
```json
{ "tripId": "t1", "status": "negotiating", "counteroffer_price": 2300 }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 COUNTEROFFER_ALREADY_SENT`

### POST `/trips/{tripId}/counteroffer/decision` (passenger)
Permisos: `passenger` ✅ | `driver` ❌ | `admin` ❌
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
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 NEGOTIATION_NOT_ACTIVE`

### POST `/trips/{tripId}/location` (driver)
Permisos: `passenger` ❌ | `driver` ✅ | `admin` ❌
Request:
```json
{ "lat": -33.4512, "lng": -61.4921, "heading": 180, "speed": 34.5, "timestamp": "2026-03-01T10:15:30Z" }
```
Response 202:
```json
{ "tripId": "t1", "location_received": true }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 TRIP_NOT_IN_MOVEMENT`

### POST `/trips/{tripId}/start` (driver)
Permisos: `passenger` ❌ | `driver` ✅ | `admin` ❌
Request:
```json
{}
```
Response 200:
```json
{ "tripId": "t1", "status": "in_progress" }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 INVALID_STATUS_TRANSITION`

### POST `/trips/{tripId}/complete` (driver)
Permisos: `passenger` ❌ | `driver` ✅ | `admin` ❌
Request:
```json
{}
```
Response 200:
```json
{ "tripId": "t1", "status": "completed", "final_price": 2300 }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 INVALID_STATUS_TRANSITION`

### POST `/trips/{tripId}/rate` (passenger)
Permisos: `passenger` ✅ | `driver` ❌ | `admin` ❌
Request:
```json
{ "score": 5, "tags": ["safe_driving", "on_time"] }
```
Response 201:
```json
{ "tripId": "t1", "ratingId": "rt_1", "score": 5 }
```
Tags predefinidos: `safe_driving`, `on_time`, `clean_vehicle`, `friendly`, `route_issue`.
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 TRIP_NOT_COMPLETED`

## Safety / Support
### POST `/safety/sos`
Permisos: `passenger` ✅ | `driver` ✅ | `admin` ❌
Request:
```json
{ "tripId": "t1", "lat": -33.45, "lng": -61.49, "message": "Me siento inseguro" }
```
Response 202:
```json
{ "status": "received", "caseId": "sos_1" }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 TRIP_NOT_ACTIVE`

### POST `/support/tickets`
Permisos: `passenger` ✅ | `driver` ✅ | `admin` ✅
Request:
```json
{ "category": "payment", "message": "No coincide el importe", "tripId": "t1" }
```
Response 201:
```json
{ "ticketId": "tk_1", "status": "open" }
```
Errores típicos: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `404 TRIP_NOT_FOUND`, `409 DUPLICATE_OPEN_TICKET`

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
