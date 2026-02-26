# 02 — Reglas de producto

**Zippy — developer: Matias Speratti**

## Terminología
- Se usa exclusivamente **trips** como concepto de viaje en API, eventos y documentación.

## Reglas generales
1. Todo viaje debe tener un estado válido de este set oficial: `requested`, `negotiating`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `cancelled`, `disputed`.
2. Un conductor solo puede tener **un viaje activo** a la vez.
3. Un pasajero solo puede tener **una solicitud activa** a la vez.
4. El precio final surge de: tarifa base + distancia + tiempo de espera.
5. El conductor visualiza destino completo solo al aceptar viaje.

## Matching
- Se prioriza conductor más cercano con estado `online`.
- Si no responde en 20 segundos, se emite un nuevo evento `trip:offer` al siguiente conductor elegible.
- Hasta 5 intentos antes de marcar solicitud como sin disponibilidad.

## Cancelaciones
- Pasajero puede cancelar sin cargo dentro de 2 minutos desde la aceptación.
- Luego de 2 minutos, se aplica cargo de cancelación mínimo.
- Conductor puede cancelar con motivo obligatorio.

## Negociación de tarifa (MVP: 1 contraoferta)
- El pasajero puede enviar **1 oferta inicial** por debajo de la estimación.
- El conductor puede responder con **1 contraoferta**.
- Durante esta etapa, el trip queda en estado `negotiating`.
- El pasajero debe aceptar o rechazar; no hay más rondas.
- Si no hay acuerdo en 60 segundos, el viaje vuelve al flujo estándar desde `requested`.

## Calificaciones
- Escala 1 a 5 al finalizar viaje.
- Comentario opcional.
- Reporte de incidente separado de la calificación.

## Estados y transiciones permitidas
- `requested` → `negotiating` | `accepted` | `cancelled`
- `negotiating` → `accepted` | `cancelled`
- `accepted` → `driver_arriving` | `cancelled`
- `driver_arriving` → `in_progress` | `cancelled`
- `in_progress` → `completed` | `disputed`
- `completed` → *(final)*
- `cancelled` → *(final)*
- `disputed` → *(final en MVP, resolución administrativa fuera del flujo transaccional)*
