# Zentra Release Runbook

## Objetivo

Generar una app instalable y publicable:

- Web publica.
- APK interno para probar en Android.
- Build iOS interno/TestFlight.
- AAB para Play Store.
- Build iOS production para App Store.

## 1. Preparar local

```bash
cd /Users/rodrigoromero/mi-app
npm run doctor
npm run ready
npm run release:check
```

## 2. Backend publico

Subir `server/` a Render, Railway, Fly.io o similar.

Variables del backend:

```bash
OPENAI_API_KEY=
PORT=3001
```

Probar:

```bash
curl https://tu-backend.com/health
```

Debe responder `ok: true`.

## 3. Variables de la app

En `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://tu-backend.com
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Supabase puede quedar vacio si vas a lanzar una beta local-first sin sync cloud.
Para lanzar con login/sync real, ejecutar antes `docs/SUPABASE_SCHEMA.sql`.

## 4. Web descargable/publica

```bash
npm run web:export
```

Subir `dist/` a Vercel, Netlify o Cloudflare Pages.

## 5. Android descargable directo

Este build genera APK interno:

```bash
npx eas build --profile preview --platform android
```

EAS devuelve un link. Ese link permite descargar e instalar el APK en Android.

## 6. iPhone descargable

En iOS no hay APK. Necesitas Apple Developer.

Para prueba interna:

```bash
npx eas build --profile preview --platform ios
```

Despues distribuir por TestFlight o internal distribution segun tu cuenta.

## 7. Play Store

Produccion Android:

```bash
npx eas build --profile production --platform android
```

Esto genera AAB para subir a Google Play Console.

## 8. App Store

Produccion iOS:

```bash
npx eas build --profile production --platform ios
```

Subir a App Store Connect/TestFlight:

```bash
npx eas submit --profile production --platform ios
```

## 9. Antes de enviar a revision

- Politica de privacidad publicada.
- Terminos publicados.
- Disclaimer de salud visible.
- Screenshots finales.
- Descripcion de tienda completa.
- Backend publico estable.
- Cuenta soporte funcionando.
- Confirmar `com.zentra.app` como identifier definitivo.

## 10. RevenueCat

Pendiente de conectar cuando tengas productos reales:

1. Crear proyecto en RevenueCat.
2. Crear entitlement `pro`.
3. Crear productos en App Store / Play Store.
4. Conectar productos a RevenueCat.
5. Crear webhook RevenueCat -> backend.
6. Backend valida evento y actualiza `public.entitlements` con service role.

La app ya tiene `services/subscriptionService.ts` preparado. El frontend no activa PRO por sí mismo.
