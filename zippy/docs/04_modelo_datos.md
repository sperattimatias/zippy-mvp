# 04 — Modelo de datos

**Zippy — developer: Matias Speratti**

## Entidades principales

### users
- `id` (uuid)
- `role` (`passenger`, `driver`, `admin`)
- `name`
- `phone`
- `email`
- `status` (`active`, `blocked`)
- `created_at`

### drivers
- `user_id` (fk users)
- `license_number`
- `vehicle_plate`
- `vehicle_model`
- `is_online` (bool)
- `current_lat`
- `current_lng`
- `rating_avg`

### trips
- `id` (uuid)
- `passenger_id` (fk users)
- `driver_id` (fk users, nullable hasta aceptar)
- `status` (`requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`)
- `origin_lat`, `origin_lng`, `origin_text`
- `dest_lat`, `dest_lng`, `dest_text`
- `estimated_fare`
- `final_fare`
- `requested_at`, `accepted_at`, `started_at`, `completed_at`

### trip_negotiations
- `id` (uuid)
- `trip_id` (fk trips)
- `passenger_offer`
- `driver_counteroffer`
- `result` (`accepted`, `rejected`, `expired`)

### payments
- `id` (uuid)
- `trip_id` (fk trips)
- `method` (`cash`, `wallet`)
- `amount`
- `status` (`pending`, `paid`, `failed`)

### safety_reports
- `id` (uuid)
- `trip_id` (fk trips)
- `reporter_user_id`
- `type` (`unsafe_driving`, `harassment`, `other`)
- `description`
- `created_at`

### audit_logs
- `id` (uuid)
- `actor_user_id`
- `action`
- `resource_type`
- `resource_id`
- `metadata_json`
- `created_at`
