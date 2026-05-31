# Supabase Setup para Zentra

## 1. Crear proyecto

1. Entrar a Supabase.
2. Crear un proyecto nuevo.
3. Guardar la contraseña de base de datos en un lugar seguro.

## 2. Crear tablas

1. Ir a SQL Editor.
2. Abrir `docs/SUPABASE_SCHEMA.sql`.
3. Pegar el contenido completo.
4. Ejecutar `Run`.

El script crea:

- `profiles`
- `plans`
- `progress_entries`
- `entitlements`
- `legal_acceptances`
- `revenuecat_events`
- Row Level Security para que cada usuario vea solo sus datos.
- Trigger para crear perfil FREE y entitlement FREE al registrarse.

Importante:

- La app solo puede leer `entitlements`.
- La app no puede activar PRO escribiendo en Supabase.
- PRO debe actualizarse desde RevenueCat/backend con `service_role`, nunca desde Expo.

## 3. Copiar credenciales públicas

Ir a Project Settings > API y copiar:

- Project URL
- anon public key

No usar la `service_role key` dentro de la app.

## 4. Configurar Expo

Crear un archivo `.env` en la raíz usando `.env.example` como base:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Después reiniciar Expo.

## 5. Probar en la app

1. Ir a Cuenta.
2. Crear cuenta.
3. Completar perfil.
4. Tocar Subir.
5. Tocar Traer.

## 6. Verificar en Supabase

En Table Editor deberían aparecer datos en:

- `profiles`
- `plans`
- `progress_entries`
- `entitlements`

`entitlements` debe quedar FREE hasta que RevenueCat/backend confirme una compra real.

## 7. Activar PRO manualmente solo para QA interno

Para probar visualmente PRO antes de RevenueCat, podés usar:

```txt
docs/SUPABASE_SET_PRO.sql
```

O actualizar un usuario desde Supabase SQL Editor:

```sql
update public.entitlements
set
  tier = 'pro',
  plan_type = 'pro',
  provider = 'manual_qa',
  product_id = 'zentra_pro_monthly',
  status = 'active',
  expires_at = null,
  updated_at = now()
where user_id = 'PEGAR_USER_ID_DE_AUTH_USERS';
```

Esto no se hace desde la app.
