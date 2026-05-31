# Zentra Product Readiness

## Estado actual

Zentra ya tiene una base de producto beta:

- App Expo Router con pantallas reales: Inicio, Crear, Plan, Coach, Progreso y PRO.
- Generación de planes IA con backend propio.
- Historial local con favoritos, edición y etiquetas.
- Tracking de progreso local con adherencia semanal y reset confirmado.
- Coach IA con contexto del plan actual.
- Capa freemium local con límites mensuales y estado FREE/PRO.
- Suscripción preparada para leer PRO desde Supabase/RevenueCat sin desbloqueo frontend local.
- Perfil local de usuario con aviso de salud aceptable antes de beta externa.

## Freemium inicial recomendado

FREE:

- 3 planes IA por mes.
- 10 mensajes Coach IA por mes.
- 1 plan guardado.
- Tracking básico de progreso.

PRO:

- Planes IA extendidos.
- Coach IA extendido.
- 20 planes guardados.
- Edición, favoritos y etiquetas.
- Base para rutinas adaptativas, progreso avanzado y futuras integraciones.

## Antes de producción

1. Cerrar QA local.
   - Crear plan, editar, favorito, historial, progreso, coach y cuenta.
   - Probar en iPhone/Android real y navegador mobile.
   - Validar teclado, scroll, tabs, inputs numericos y estados vacios.

2. Preparar marca y stores.
   - Nombre final, icono, splash, screenshots y descripcion corta/larga.
   - Bundle id final iOS y package final Android.
   - Politica de privacidad, terminos, aviso medico y canal de soporte.

3. Conectar pagos reales.
   - iOS/Android: RevenueCat o compras nativas.
   - Web: Stripe Checkout o Stripe Customer Portal.
   - Recovery de compras y estado PRO cross-platform.

4. Mover datos críticos al backend.
   - Usuario.
   - Planes guardados.
   - Progreso.
- Entitlements PRO.
   - Aceptación de disclaimers legales.

5. Preparar publicación.
   - Web: build Expo web + hosting.
   - App Store: EAS Build + Apple Developer.
   - Play Store: EAS Build + Google Play Console.
   - Analytics y crash reporting antes de abrir beta externa.

6. Endurecer producto.
   - Login.
   - Sync multi-dispositivo.
   - Recuperación de compras.
   - Política de privacidad.
   - Términos.
   - Disclaimer de salud.

## Modelo de datos a subir al backend

El schema inicial está listo en `docs/SUPABASE_SCHEMA.sql`.

- `users`: email, nombre, fecha de creación, preferencias.
- `profiles`: rango de edad, preferencia de entrenamiento, nota de contexto.
- `plans`: objetivo, nivel, días, lugar, minutos, idioma, rutina, nutrición, mindset, favoritos, etiquetas.
- `progress_entries`: planId, minutos, nota, fecha completada.
- `entitlements`: tier, provider, productId, purchaseStatus, expiresAt.
- `legal_acceptances`: userId, documentType, version, acceptedAt.
