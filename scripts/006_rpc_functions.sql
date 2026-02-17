-- ============================================================
-- 006: RPC helper functions
-- ============================================================

-- increment_sticker: +1 to owned_count for authenticated user
create or replace function public.increment_sticker(p_sticker_number int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_stickers
  set owned_count = owned_count + 1,
      updated_at = now()
  where user_id = auth.uid()
    and sticker_number = p_sticker_number;
end;
$$;

-- decrement_sticker: -1 to owned_count (min 0) for authenticated user
create or replace function public.decrement_sticker(p_sticker_number int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_stickers
  set owned_count = greatest(owned_count - 1, 0),
      updated_at = now()
  where user_id = auth.uid()
    and sticker_number = p_sticker_number;
end;
$$;

-- set_sticker_count: set exact owned_count for authenticated user
create or replace function public.set_sticker_count(p_sticker_number int, p_count int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_stickers
  set owned_count = greatest(p_count, 0),
      updated_at = now()
  where user_id = auth.uid()
    and sticker_number = p_sticker_number;
end;
$$;

-- search_collectors_with_duplicate: find users who have duplicate of sticker X
create or replace function public.search_collectors_with_duplicate(p_sticker_number int)
returns table (
  id uuid,
  display_name text,
  avatar_url text,
  city text,
  country text,
  duplicate_count int
)
language sql
security definer
set search_path = public
as $$
  select u.id, u.display_name, u.avatar_url, u.city, u.country,
         (us.owned_count - 1)::int as duplicate_count
  from public.user_stickers us
  join public.users u on u.id = us.user_id
  where us.sticker_number = p_sticker_number
    and us.owned_count > 1
    and us.user_id != auth.uid();
$$;

-- search_collectors_needing: find users who need sticker X
create or replace function public.search_collectors_needing(p_sticker_number int)
returns table (
  id uuid,
  display_name text,
  avatar_url text,
  city text,
  country text
)
language sql
security definer
set search_path = public
as $$
  select u.id, u.display_name, u.avatar_url, u.city, u.country
  from public.user_stickers us
  join public.users u on u.id = us.user_id
  where us.sticker_number = p_sticker_number
    and us.owned_count = 0
    and us.user_id != auth.uid();
$$;
