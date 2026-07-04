-- ── Credits & plan columns ───────────────────────────────────────────────────
alter table public.profiles
  add column if not exists credits integer not null default 20,
  add column if not exists plan    text    not null default 'solo';

-- Atomic credit deduction function.
-- Returns remaining credits after deduction, or -1 if insufficient.
create or replace function public.deduct_credits(p_user_id uuid, p_amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  cur integer;
begin
  select credits into cur from profiles where id = p_user_id for update;
  if cur is null or cur < p_amount then
    return -1;
  end if;
  update profiles set credits = credits - p_amount, updated_at = now() where id = p_user_id;
  return cur - p_amount;
end;
$$;
