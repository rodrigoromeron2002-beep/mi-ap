-- Zentra Supabase schema
-- Copiar y ejecutar completo en Supabase SQL Editor.
-- Usar solo EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en la app.
-- Nunca poner service_role key en Expo/frontend.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text default '',
  age_range text default '',
  training_preference text default '',
  health_note text default '',
  accepted_health_disclaimer boolean default false,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro')),
  subscription_status text not null default 'active' check (
    subscription_status in ('active', 'inactive', 'expired', 'trialing')
  ),
  updated_at timestamptz default now()
);

create table if not exists public.plans (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  goal text not null,
  level text not null,
  days integer not null,
  place text not null,
  minutes integer not null,
  language text not null default 'es',
  routine text not null default '',
  nutrition text not null default '',
  mindset text not null default '',
  favorite boolean default false,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.progress_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text,
  plan_goal text,
  minutes integer not null,
  note text,
  completed_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  plan_type text not null default 'free' check (plan_type in ('free', 'pro')),
  provider text not null default 'supabase',
  product_id text,
  revenuecat_app_user_id text,
  status text not null default 'active' check (status in ('active', 'inactive', 'expired', 'trialing')),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  version text not null,
  accepted_at timestamptz not null default now()
);

create table if not exists public.revenuecat_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_id text unique,
  event_type text,
  product_id text,
  raw_event jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.progress_entries enable row level security;
alter table public.entitlements enable row level security;
alter table public.legal_acceptances enable row level security;
alter table public.revenuecat_events enable row level security;

revoke update (plan_type, subscription_status) on public.profiles from authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "plans_all_own" on public.plans;
drop policy if exists "progress_all_own" on public.progress_entries;
drop policy if exists "entitlements_select_own" on public.entitlements;
drop policy if exists "entitlements_insert_own_dev" on public.entitlements;
drop policy if exists "entitlements_update_own_dev" on public.entitlements;
drop policy if exists "legal_acceptances_all_own" on public.legal_acceptances;
drop policy if exists "revenuecat_events_no_client_access" on public.revenuecat_events;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "plans_all_own"
on public.plans for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "progress_all_own"
on public.progress_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- El usuario puede leer su entitlement, pero NO puede crearlo ni editarlo desde la app.
-- PRO debe venir de RevenueCat/backend usando service_role fuera del frontend.
create policy "entitlements_select_own"
on public.entitlements for select
using (auth.uid() = user_id);

create policy "legal_acceptances_all_own"
on public.legal_acceptances for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Sin policies de select/insert/update: inaccesible para anon/authenticated.
-- Solo service_role/backend debe escribir eventos RevenueCat.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan_type, subscription_status)
  values (new.id, new.email, 'free', 'active')
  on conflict (id) do nothing;

  insert into public.entitlements (user_id, tier, plan_type, provider, product_id, status)
  values (new.id, 'free', 'free', 'supabase', 'zentra_free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists plans_set_updated_at on public.plans;
create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

drop trigger if exists entitlements_set_updated_at on public.entitlements;
create trigger entitlements_set_updated_at
before update on public.entitlements
for each row execute function public.set_updated_at();
