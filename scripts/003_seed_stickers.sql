-- ============================================================
-- 003: Seed the stickers table with numbers 1-200
-- ============================================================
insert into public.stickers (number)
select generate_series(1, 200)
on conflict (number) do nothing;
