# 02 — Reglas de producto

**Zippy — developer: Matias Speratti**

## Reglas generales
1. Todo viaje debe tener estado válido: `requested`, `offered`, `accepted`, `arriving`, `in_progress`, `completed`, `cancelled`.
2. Un conductor solo puede tener **un viaje activo** a la vez.
3. Un pasajero solo puede tener **una solicitud activa** a la vez.
4. El precio final surge de: tarifa base + distancia + tiempo de espera.
5. El conductor visualiza destino completo solo al aceptar viaje.

## Matching
- Se prioriza conductor más cercano con estado `online`.
- Si no responde en 20 segundos, se oferta al siguiente conductor elegible.
- Hasta 5 intentos antes de marcar solicitud como sin disponibilidad.

## Cancelaciones
- Pasajero puede cancelar sin cargo dentro de 2 minutos desde la aceptación.
- Luego de 2 minutos, se aplica cargo de cancelación mínimo.
- Conductor puede cancelar con motivo obligatorio.

## Negociación de tarifa (MVP: 1 contraoferta)
- El pasajero puede enviar **1 oferta inicial** por debajo de la estimación.
- El conductor puede responder con **1 contraoferta**.
- El pasajero debe aceptar o rechazar; no hay más rondas.
- Si no hay acuerdo en 60 segundos, el viaje vuelve al flujo estándar.

## Calificaciones
- Escala 1 a 5 al finalizar viaje.
- Comentario opcional.
- Reporte de incidente separado de la calificación.
