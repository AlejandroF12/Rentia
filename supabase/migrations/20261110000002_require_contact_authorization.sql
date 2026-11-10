create or replace function public.get_public_equipment_owner(p_owner_id uuid)
returns table (id uuid, full_name text, phone text, municipality text)
language sql
stable
security definer
set search_path = public
as $$
  select profile.id, profile.full_name, profile.phone, profile.municipality
  from public.profiles as profile
  where auth.uid() is not null
    and profile.id = p_owner_id
    and profile.role = 'arrendador'
    and profile.status = 'activo'
    and profile.contact_authorized
    and exists (
      select 1
      from public.equipment as item
      where item.owner_id = profile.id
        and item.publication_status = 'publicada'
    );
$$;

revoke all on function public.get_public_equipment_owner(uuid) from public, anon;
grant execute on function public.get_public_equipment_owner(uuid) to authenticated;
