grant usage on schema public to anon, authenticated;

grant select on public.equipment to anon, authenticated;
grant select on public.equipment_images to anon, authenticated;
grant select on public.reviews to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant insert, select, update, delete on public.equipment to authenticated;
grant insert, select, update, delete on public.equipment_images to authenticated;
grant insert, select, delete on public.favorites to authenticated;
grant insert, select, update, delete on public.reviews to authenticated;
grant insert, select, update on public.reports to authenticated;
grant insert, select, update, delete on public.contact_authorizations to authenticated;

grant execute on function public.nearby_equipment(numeric, numeric, numeric) to anon, authenticated;
