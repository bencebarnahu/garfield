-- ============================================================
-- 005: Derived SQL views
-- ============================================================

create or replace view public.duplicates_view as
select
  user_id,
  sticker_number,
  owned_count - 1 as duplicate_count
from public.user_stickers
where owned_count > 1;

create or replace view public.missing_view as
select
  user_id,
  sticker_number
from public.user_stickers
where owned_count = 0;
