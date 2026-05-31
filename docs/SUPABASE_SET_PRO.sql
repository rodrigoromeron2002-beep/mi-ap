-- Zentra QA/Admin: poner usuarios en PRO desde Supabase SQL Editor.
-- Esto NO va en el frontend. Usalo solo desde Supabase o backend con permisos seguros.

-- OPCION A: poner TODOS los usuarios existentes en PRO.
update public.entitlements
set
  tier = 'pro',
  plan_type = 'pro',
  provider = 'manual_qa',
  product_id = 'zentra_pro_monthly',
  status = 'active',
  expires_at = null,
  updated_at = now();

update public.profiles
set
  plan_type = 'pro',
  subscription_status = 'active',
  updated_at = now();

-- OPCION B: poner UN usuario especifico en PRO.
-- Reemplazá PEGAR_USER_ID_DE_AUTH_USERS por el id del usuario en Authentication > Users.
/*
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

update public.profiles
set
  plan_type = 'pro',
  subscription_status = 'active',
  updated_at = now()
where id = 'PEGAR_USER_ID_DE_AUTH_USERS';
*/

-- OPCION C: volver TODOS los usuarios a FREE.
/*
update public.entitlements
set
  tier = 'free',
  plan_type = 'free',
  provider = 'supabase',
  product_id = 'zentra_free',
  status = 'active',
  expires_at = null,
  updated_at = now();

update public.profiles
set
  plan_type = 'free',
  subscription_status = 'active',
  updated_at = now();
*/
