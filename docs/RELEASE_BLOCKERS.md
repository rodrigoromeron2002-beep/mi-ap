# Zentra Release Blockers

Estado: beta local funcional.

Este archivo separa bloqueadores reales de produccion de tareas que ya estan cubiertas localmente.

## Cubierto localmente

- TypeScript compila con `npm run typecheck`.
- Lint pasa con `npm run lint`.
- Configuracion base pasa con `npm run prod:check`.
- Configuracion de builds pasa con `npm run release:check`.
- Backend compila con `npm run backend:build`.
- Web exporta correctamente con `npm run web:export`.
- Flujo local probado en web: crear plan, abrir plan, favorito, guardar edicion, progreso, reset semanal, coach, cuenta, aviso de salud y PRO/freemium.

## Bloqueadores antes de usuarios externos

1. Backend publico.
   - Subir `server/` a un hosting.
   - Configurar `OPENAI_API_KEY` real.
   - Cambiar `EXPO_PUBLIC_API_BASE_URL` a la URL publica.
   - Confirmar que `.env` tenga `EXPO_PUBLIC_DEV_UNLOCK_PRO=false` antes de build preview.
   - Probar `/health`, Crear y Coach contra produccion.

2. Supabase real.
   - Crear proyecto Supabase.
   - Ejecutar `docs/SUPABASE_SCHEMA.sql`.
   - Cargar `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
   - Probar registro, login, subir datos y traer datos.

3. QA en dispositivos reales.
   - iPhone fisico o TestFlight.
   - Android fisico o build preview APK.
   - Revisar teclado, scroll, tabs, inputs, navegacion, performance y estados vacios.

4. Pagos PRO.
   - RevenueCat para iOS/Android.
   - Stripe solo si la version web va a cobrar.
   - Webhook/backend para escribir entitlements PRO en Supabase con permisos seguros.

5. Legal y publicacion.
   - Politica de privacidad publicada.
   - Terminos publicados.
   - Aviso medico final revisado.
   - Email de soporte.
   - Data Safety / App Privacy.

6. Assets y tienda.
   - Confirmar icono y splash finales.
   - Screenshots iPhone y Android.
   - Descripcion corta/larga, keywords y metadata.

## Gate local recomendado

Antes de avanzar a cada fase externa:

```bash
npm run qa:local
```

Antes de builds:

```bash
npm run preview:check
npm run web:export
npx eas build --profile preview --platform all
```

Tambien hay scripts directos:

```bash
npm run build:preview:android
npm run build:preview:ios
npm run build:preview:all
```
