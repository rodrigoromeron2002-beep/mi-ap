# Zentra Deployment Checklist

## Web

1. Definir URL pública del backend.
2. Setear `expo.extra.apiBaseUrl` con esa URL.
3. Ejecutar build web:
   - `npx expo export --platform web`
4. Subir `dist/` a Vercel, Netlify, Cloudflare Pages o hosting estático.
5. Verificar:
   - Generación de plan.
   - Coach IA.
   - Pantalla Cuenta muestra backend `ONLINE`.

## App Store y Play Store

1. Confirmar identifiers:
   - iOS: `com.zentra.app`
   - Android: `com.zentra.app`
2. Crear cuentas:
   - Apple Developer Program.
   - Google Play Console.
3. Configurar EAS:
   - `npx eas login`
   - `npx eas build:configure`
4. Builds:
   - Preview: `npx eas build --profile preview --platform all`
   - Producción: `npx eas build --profile production --platform all`
5. Antes de enviar:
   - Icono final.
   - Splash final.
   - Screenshots por dispositivo.
   - Política de privacidad.
   - Términos.
   - Disclaimer fitness/salud.

## Pagos PRO

Opción recomendada:

- Mobile: RevenueCat conectado a App Store / Play Store.
- Web: Stripe Checkout.
- Backend: guardar entitlements reales por usuario.

Flujo final:

1. Usuario inicia sesión.
2. Compra PRO.
3. Provider confirma pago.
4. Backend guarda entitlement.
5. App desbloquea límites PRO desde backend, no solo local.

## Supabase

1. Crear proyecto Supabase.
2. Ejecutar `docs/SUPABASE_SCHEMA.sql` en SQL Editor.
3. Copiar Project URL y anon public key.
4. Crear `.env` usando `.env.example`:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. Reiniciar Expo.
6. Entrar a `Cuenta`, crear usuario y probar `Sincronizar ahora`.

Guía detallada: `docs/SUPABASE_SETUP.md`.
