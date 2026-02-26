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
Errores:
- `401 INVALID_OTP`
- `429 OTP_RATE_LIMIT`

## Trips
### POST `/trips`
Request:
```json
{
  "origin": { "lat": -33.46, "lng": -61.48, "text": "San Martín 1200" },
  "destination": { "lat": -33.44, "lng": -61.50, "text": "Terminal de Ómnibus" },
  "passengerOffer": 2100
}
```
Response 201:
```json
{ "tripId": "t1", "status": "requested", "estimatedFare": 2400 }
```
Errores:
- `400 INVALID_GEO`
- `409 PASSENGER_ACTIVE_TRIP`

### POST `/trips/{tripId}/accept` (driver)
Response 200:
```json
{ "tripId": "t1", "status": "accepted" }
```
Errores:
- `404 TRIP_NOT_FOUND`
- `409 TRIP_NOT_AVAILABLE`

### POST `/trips/{tripId}/counteroffer` (driver)
Request:
```json
{ "amount": 2300 }
```
Response 200:
```json
{ "tripId": "t1", "negotiation": { "driverCounteroffer": 2300, "status": "pending_passenger" } }
```
Errores:
- `409 NEGOTIATION_NOT_ALLOWED`

### POST `/trips/{tripId}/counteroffer/decision` (passenger)
Request:
```json
{ "decision": "accept" }
```
Response 200:
```json
{ "tripId": "t1", "negotiationResult": "accepted", "finalFare": 2300 }
```
Errores:
- `400 INVALID_DECISION`
- `410 NEGOTIATION_EXPIRED`

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
Errores:
- `404 TRIP_NOT_FOUND`

### POST `/safety/reports`
Request:
```json
{ "tripId": "t1", "type": "unsafe_driving", "description": "Frenadas bruscas" }
```
Response 201:
```json
{ "reportId": "r1", "status": "open" }
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
