# Backend Service (NestJS)

**Zippy — developer: Matias Speratti**

Backend MVP de Zippy con NestJS + Prisma + PostgreSQL + Socket.IO.

## Módulos
- `auth` (OTP SMS con `SmsProvider`, `DevSmsProvider`, `PlaceholderTwilioProvider`)
- `users`
- `drivers`
- `trips`
- `ratings`
- `support`
- `safety`
- `realtime` (Gateway Socket.IO)

## Requisitos
- Node.js 20+
- Docker / Docker Compose

## Setup local
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## Docker Compose (backend + postgres)
```bash
docker compose up -d
```

## Scripts útiles
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Naming y estados oficiales
Entidad principal: **trips**.
Estados exactos de trip:
`requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`.
