-- ============================================================
-- 002: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.stickers enable row level security;
alter table public.user_stickers enable row level security;

-- -------------------------------------------------------
-- users policies
-- -------------------------------------------------------
-- Public read: anyone can view profiles
create policy "users_select_public" on public.users
  for select using (true);

-- Owner update: users can update only their own profile
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Owner insert: users can insert their own profile (needed for trigger fallback)
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

-- -------------------------------------------------------
-- stickers policies (read-only seed table)
-- -------------------------------------------------------
create policy "stickers_select_public" on public.stickers
  for select using (true);

-- -------------------------------------------------------
-- user_stickers policies
-- -------------------------------------------------------
-- Public read: anyone can view album data (for search & public album views)
create policy "user_stickers_select_public" on public.user_stickers
  for select using (true);

-- Owner insert
create policy "user_stickers_insert_own" on public.user_stickers
  for insert with check (auth.uid() = user_id);

-- Owner update
create policy "user_stickers_update_own" on public.user_stickers
  for update using (auth.uid() = user_id);

-- Owner delete
create policy "user_stickers_delete_own" on public.user_stickers
  for delete using (auth.uid() = user_id);
