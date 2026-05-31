# Zentra Launch Plan

## Fase 1 - Cierre local

Objetivo: que la app funcione perfecta sin Supabase.

Checklist:

- Crear plan.
- Abrir plan activo.
- Editar rutina, alimentacion, mindset y etiquetas.
- Marcar favorito.
- Abrir plan desde historial.
- Borrar plan individual.
- Limpiar historial.
- Registrar sesion.
- Reiniciar adherencia semanal.
- Probar Coach IA.
- Cambiar FREE/PRO demo.
- Guardar perfil.
- Aceptar aviso de salud.

Comandos:

```bash
npm run ready
npm run release:check
npm run web:export
```

## Fase 2 - Backend real

Objetivo: dejar de depender de localhost.

Pasos:

1. Subir `server/` a Render, Railway, Fly.io o similar.
2. Configurar `OPENAI_API_KEY`.
3. Confirmar endpoint `/health`.
4. Copiar la URL publica.
5. Crear `.env` en la app:

```bash
EXPO_PUBLIC_API_BASE_URL=https://tu-backend.com
```

6. Reiniciar Expo y probar Crear + Coach.

## Fase 3 - Web publica

Objetivo: publicar una version web usable.

Pasos:

1. Ejecutar:

```bash
npm run web:export
```

2. Subir `dist/` a Vercel, Netlify o Cloudflare Pages.
3. Configurar variables de entorno en hosting.
4. Probar desde celular:
   - Home.
   - Crear.
   - Plan.
   - Coach.
   - Cuenta.
   - PRO.

## Fase 4 - Marca y stores

Objetivo: preparar assets y metadata.

Necesario:

- Nombre final.
- Icono 1024x1024.
- Splash.
- Screenshots iPhone.
- Screenshots Android.
- Descripcion corta.
- Descripcion larga.
- Keywords.
- Email de soporte.
- Politica de privacidad.
- Terminos.

## Fase 5 - Supabase

Objetivo: login y datos cloud.

Pasos:

1. Crear proyecto Supabase.
2. Ejecutar `docs/SUPABASE_SCHEMA.sql`.
3. Completar `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

4. Probar Cuenta, registro, login, sync y pull.

## Fase 6 - Freemium real

Objetivo: cobrar PRO.

Recomendacion:

- Mobile: RevenueCat.
- Web: Stripe.
- Backend/Supabase: guardar entitlement real.

No usar estado PRO local para produccion paga.

## Fase 7 - App Store / Play Store

Comandos base:

```bash
npx eas login
npx eas build:configure
npx eas build --profile preview --platform all
npx eas build --profile production --platform all
```

Antes de enviar:

- QA en dispositivo real.
- Backend publico online.
- Politica y terminos publicados.
- Capturas finales.
- Version y build number correctos.

Guia operativa completa: `docs/RELEASE_RUNBOOK.md`.
