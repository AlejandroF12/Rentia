do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.reviews'::regclass
      and tgname = 'reviews_enforce_participation'
      and not tgisinternal
  ) then
    raise exception 'Aplica primero la migración que instala reviews_enforce_participation.';
  end if;
end;
$$;

drop policy if exists "Users can create their reviews" on public.reviews;
-- The participation trigger validates account status, roles, and equipment ownership.
create policy "Users can create their reviews"
on public.reviews for insert
to authenticated
with check (author_id = (select auth.uid()));
