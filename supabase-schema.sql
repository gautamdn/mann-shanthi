-- Antara: Supabase database schema
-- Run this in your Supabase SQL Editor after creating the project

-- profiles: extends auth.users with app-specific data
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_name text not null default '',
  has_onboarded boolean not null default false,
  streak integer not null default 0,
  last_active_date text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- mood_logs: one per user per day
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date text not null,
  mood smallint not null check (mood between 1 and 5),
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- journal_entries
create table public.journal_entries (
  id text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  date text not null,
  prompt text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- Row-level security
alter table public.profiles enable row level security;
alter table public.mood_logs enable row level security;
alter table public.journal_entries enable row level security;

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users select own mood_logs" on public.mood_logs for select using (auth.uid() = user_id);
create policy "Users insert own mood_logs" on public.mood_logs for insert with check (auth.uid() = user_id);
create policy "Users update own mood_logs" on public.mood_logs for update using (auth.uid() = user_id);
create policy "Users delete own mood_logs" on public.mood_logs for delete using (auth.uid() = user_id);

create policy "Users select own journal_entries" on public.journal_entries for select using (auth.uid() = user_id);
create policy "Users insert own journal_entries" on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "Users update own journal_entries" on public.journal_entries for update using (auth.uid() = user_id);
create policy "Users delete own journal_entries" on public.journal_entries for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- v2: Roles, invite codes, patient assignments

-- Add role to profiles
alter table public.profiles
  add column role text not null default 'public'
  check (role in ('public', 'patient', 'therapist'));

-- Invite codes
create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_by uuid not null references public.profiles(id),
  used_by uuid references public.profiles(id),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.invite_codes enable row level security;

create policy "Therapists manage own codes"
  on public.invite_codes for all
  using (created_by = auth.uid());

create policy "Anyone can look up a code for redemption"
  on public.invite_codes for select
  using (true);

-- Patient assignments
create table public.patient_assignments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('journal_prompt', 'breathing_exercise', 'weekly_plan')),
  content jsonb not null,
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.patient_assignments enable row level security;

create policy "Patients read own assignments"
  on public.patient_assignments for select
  using (patient_id = auth.uid());

create policy "Patients update own assignments"
  on public.patient_assignments for update
  using (patient_id = auth.uid());

create policy "Therapists manage assignments they created"
  on public.patient_assignments for all
  using (assigned_by = auth.uid());

-- Atomic invite code redemption
create or replace function public.redeem_invite_code(invite_code text)
returns boolean as $$
declare
  code_row record;
begin
  select * into code_row from public.invite_codes
  where code = invite_code and used_by is null and expires_at > now();

  if not found then return false; end if;

  update public.invite_codes set used_by = auth.uid() where id = code_row.id;
  update public.profiles set role = 'patient' where id = auth.uid();
  return true;
end;
$$ language plpgsql security definer;
