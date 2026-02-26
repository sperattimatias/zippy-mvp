# 03 — Flujos MVP

**Zippy — developer: Matias Speratti**

## Flujo pasajero
1. Abrir app y autenticarse.
2. Definir origen/destino.
3. Ver tarifa estimada.
4. Confirmar solicitud (opcional: oferta inicial).
5. Recibir asignación de conductor.
6. Seguir llegada y viaje en mapa.
7. Finalizar y pagar.
8. Calificar/reportar si corresponde.

## Flujo conductor
1. Iniciar sesión y pasar a `online`.
2. Recibir oferta de viaje.
3. Aceptar/rechazar (o contraoferta única si aplica).
4. Ir a buscar pasajero (`arriving`).
5. Iniciar viaje (`in_progress`).
6. Finalizar viaje (`completed`).
7. Ver resumen de ganancia y calificar pasajero.

## Flujo admin
1. Revisar tablero básico: viajes del día, cancelaciones, incidentes.
2. Consultar reportes de seguridad.
3. Bloquear temporalmente usuarios ante incidentes críticos.
4. Exportar resumen diario simple (CSV).
