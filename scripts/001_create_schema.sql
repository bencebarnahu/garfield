-- ============================================================
-- 001: Sticker Exchange Schema
-- Tables: users, stickers, user_stickers
-- ============================================================

-- 1) Users (profile extension of auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  city text,
  country text,
  created_at timestamptz not null default now()
);

-- 2) Stickers (static seed table, 1-200)
create table if not exists public.stickers (
  number int primary key
);

-- 3) User stickers (core album table)
create table if not exists public.user_stickers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  sticker_number int not null references public.stickers(number),
  owned_count int not null default 0 check (owned_count >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, sticker_number)
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_user_stickers_user on public.user_stickers(user_id);
create index if not exists idx_user_stickers_sticker on public.user_stickers(sticker_number);
create index if not exists idx_user_stickers_owned_count on public.user_stickers(owned_count);
create index if not exists idx_user_stickers_composite on public.user_stickers(user_id, sticker_number);
