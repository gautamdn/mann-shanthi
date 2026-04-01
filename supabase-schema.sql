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
