# Zentra - empezar rapido

## Abrir desde VS Code

Abrí exactamente esta carpeta:

```bash
/Users/rodrigoromero/mi-app
```

No abras la carpeta de Codex, porque no contiene la app real.

## Arranque local

Terminal 1:

```bash
npm run backend
```

Terminal 2:

```bash
npm run web
```

Si Expo queda raro por cache:

```bash
npm run start:clear
```

## Estado funcional actual

- Sin `OPENAI_API_KEY`, el backend funciona en modo demo para que puedas probar la app completa.
- Con `OPENAI_API_KEY` en `server/.env`, genera planes y coach con IA real.
- Sin Supabase, la app funciona con almacenamiento local.
- Con Supabase configurado, se habilita login/sync cloud.

## Variables necesarias

App `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Backend `server/.env`:

```bash
OPENAI_API_KEY=
PORT=3001
```

## Checks

```bash
npm run qa:local
npm run doctor
npm run typecheck
npm run lint
npm run prod:check
npm run preview:check
npm run supabase:check
```

`npm run qa:local` es el gate recomendado antes de avanzar de fase. Corre typecheck,
lint, checks de produccion, release check, build del backend y export web.
`npm run preview:check` valida que el build preview no apunte a localhost ni use PRO local.

## Para dejarla 100% lista

1. Confirmar `com.zentra.app` como bundle/package final.
2. Cargar `OPENAI_API_KEY` real.
3. Crear Supabase, ejecutar `docs/SUPABASE_SCHEMA.sql` y cargar URL/anon key.
4. Probar web, Expo Go, iOS y Android.
5. Crear icono/splash finales.
6. Cambiar `EXPO_PUBLIC_API_BASE_URL` a la URL publica del backend y dejar `EXPO_PUBLIC_DEV_UNLOCK_PRO=false`.
7. Generar builds con EAS:

```bash
npm run build:preview:android
npm run build:preview:ios
```
