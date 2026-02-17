-- ============================================================
-- 004: Auto-provision user profile and 200 album rows on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert profile row from OAuth metadata
  insert into public.users (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Collector'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', null)
  )
  on conflict (id) do nothing;

  -- Insert 200 album rows with owned_count = 0
  insert into public.user_stickers (user_id, sticker_number, owned_count)
  select new.id, s.number, 0
  from public.stickers s
  on conflict (user_id, sticker_number) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
