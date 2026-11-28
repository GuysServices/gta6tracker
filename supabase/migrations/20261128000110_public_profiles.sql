-- Public tracker profile cards: expose only the public profile table (username/avatar).
alter table public.profiles enable row level security;
drop policy if exists "Public can view tracker profiles" on public.profiles;
create policy "Public can view tracker profiles"
  on public.profiles for select
  using (true);
