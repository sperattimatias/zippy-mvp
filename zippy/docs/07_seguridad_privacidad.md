# 07 — Seguridad y privacidad

**Zippy — developer: Matias Speratti**

## Seguridad operacional MVP
- Verificación básica de identidad de conductor y vehículo antes de activar cuenta.
- Botón SOS en viaje activo para pasajero y conductor.
- Compartir viaje por enlace temporal con estado y ubicación aproximada.
- Reportes in-app al finalizar viaje o durante incidente.

## SOS
1. Usuario presiona SOS.
2. Backend registra caso y prioriza alerta en panel admin.
3. Se conserva última ubicación conocida y datos del viaje.
4. Operador administra protocolo local de asistencia.

## Compartir viaje
- URL temporal vinculada al `tripId`.
- Muestra: estado del viaje, conductor, vehículo y posición aproximada.
- Expira automáticamente al finalizar/cancelar viaje.

## Reportes
- Tipos mínimos: conducción insegura, acoso, otro.
- Cada reporte genera ticket con trazabilidad.
- Admin puede bloquear preventivamente cuentas en casos críticos.

## Privacidad y retención de logs
- Datos sensibles cifrados en tránsito (HTTPS/WSS).
- Acceso por roles mínimos necesarios.
- Retención de `audit_logs`: 180 días.
- Retención de eventos de ubicación de viaje: 30 días.
- Eliminación o anonimización al vencer retención, salvo obligación legal.
