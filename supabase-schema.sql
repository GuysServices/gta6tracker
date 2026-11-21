-- ================================================================
-- GTA VI Tracker — Supabase Schema
-- Run this entire file in: Supabase > SQL Editor > New query
-- ================================================================

-- Profiles table (auto-created on first login via auth callback)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Progress table (one row per user per mission)
create table if not exists public.user_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  mission_id  text not null,
  status      text not null check (status in ('incomplete','completed','failed','skipped')),
  note        text,
  updated_at  timestamptz default now(),
  unique(user_id, mission_id)
);

-- Indexes for fast lookups
create index if not exists user_progress_user_id_idx    on public.user_progress(user_id);
create index if not exists user_progress_mission_id_idx on public.user_progress(mission_id);
create index if not exists user_progress_status_idx     on public.user_progress(status);

-- ================================================================
-- Row Level Security
-- ================================================================

alter table public.profiles      enable row level security;
alter table public.user_progress enable row level security;

-- Profiles: anyone can read, only owner can write
create policy "profiles_select_all"
  on public.profiles for select using (true);

create policy "profiles_insert_own"
  on public.profiles for insert with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- Progress: anyone can read (for global stats), only owner can write
create policy "progress_select_all"
  on public.user_progress for select using (true);

create policy "progress_insert_own"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "progress_update_own"
  on public.user_progress for update using (auth.uid() = user_id);

create policy "progress_delete_own"
  on public.user_progress for delete using (auth.uid() = user_id);
-- ================================================================
-- Role grants (required — SQL-editor tables do not auto-grant)
-- ================================================================

grant usage on schema public to anon, authenticated;

grant select                           on public.profiles      to anon;
grant select, insert, update           on public.profiles      to authenticated;

grant select                           on public.user_progress to anon;
grant select, insert, update, delete   on public.user_progress to authenticated;

-- ================================================================
-- Done. Tables: profiles, user_progress
-- ================================================================
