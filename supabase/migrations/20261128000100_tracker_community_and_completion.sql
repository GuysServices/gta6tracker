-- GTA VI Tracker: personal map completion and community submissions
create table if not exists public.user_location_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  location_id integer not null,
  is_completed boolean not null default false,
  is_favorite boolean not null default false,
  note text,
  updated_at timestamptz not null default now(),
  primary key (user_id, location_id)
);
alter table public.user_location_progress enable row level security;
drop policy if exists "Users manage their own location progress" on public.user_location_progress;
create policy "Users manage their own location progress"
  on public.user_location_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  area text not null,
  category text not null default 'Other',
  description text not null,
  evidence_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
alter table public.community_submissions enable row level security;
drop policy if exists "Users can submit map discoveries" on public.community_submissions;
create policy "Users can submit map discoveries"
  on public.community_submissions for insert
  with check (auth.uid() = user_id);
drop policy if exists "Users can view their own or approved discoveries" on public.community_submissions;
create policy "Users can view their own or approved discoveries"
  on public.community_submissions for select
  using (auth.uid() = user_id or status = 'approved');

create index if not exists user_location_progress_completed_idx
  on public.user_location_progress (user_id, is_completed);
create index if not exists community_submissions_status_created_idx
  on public.community_submissions (status, created_at desc);
