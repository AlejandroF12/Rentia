grant select, insert, delete on table public.favorites to authenticated;

drop policy if exists "Users manage their favorites" on public.favorites;

create policy "Users manage their favorites"
on public.favorites for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
