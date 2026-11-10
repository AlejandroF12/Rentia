drop policy if exists "Profiles are visible to authenticated users" on public.profiles;

create policy "Users and admins can view private profiles"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create or replace view public.public_profiles
with (security_barrier = true)
as
select id, full_name, municipality, role, created_at
from public.profiles
where status = 'activo'
  and role <> 'admin'
  and (
    exists (
      select 1
      from public.equipment
      where equipment.owner_id = profiles.id
        and equipment.publication_status = 'publicada'
    )
    or exists (
      select 1
      from public.reviews
      where reviews.author_id = profiles.id
        and reviews.is_published
    )
    or exists (
      select 1
      from public.reviews
      where reviews.target_user_id = profiles.id
        and reviews.is_published
    )
  );

grant select on public.public_profiles to anon, authenticated;

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
    and exists (
      select 1
      from public.equipment as item
      where item.owner_id = profile.id
        and item.publication_status = 'publicada'
    );
$$;

revoke all on function public.get_public_equipment_owner(uuid) from public, anon;
grant execute on function public.get_public_equipment_owner(uuid) to authenticated;

create or replace function public.prevent_owner_moderated_equipment_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin()
    and old.publication_status in ('suspendida', 'eliminada')
    and new.publication_status is distinct from old.publication_status then
    raise exception 'Solo administración puede cambiar el estado de una publicación suspendida o eliminada';
  end if;
  return new;
end;
$$;

drop trigger if exists equipment_prevent_owner_moderated_status_change on public.equipment;
create trigger equipment_prevent_owner_moderated_status_change
before update of publication_status on public.equipment
for each row execute function public.prevent_owner_moderated_equipment_status_change();

drop policy if exists "Owners and admins can delete equipment" on public.equipment;
revoke delete on public.equipment from authenticated;

create or replace function public.prevent_author_review_moderation_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and old.is_published is distinct from new.is_published then
    raise exception 'Solo administración puede cambiar la visibilidad de una valoración';
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_prevent_author_visibility_change on public.reviews;
create trigger reviews_prevent_author_visibility_change
before update of is_published on public.reviews
for each row execute function public.prevent_author_review_moderation_changes();

create or replace function public.prevent_author_deleting_hidden_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and not old.is_published then
    raise exception 'Una valoración oculta por moderación no puede ser eliminada por su autor';
  end if;
  return old;
end;
$$;

drop trigger if exists reviews_prevent_author_hidden_delete on public.reviews;
create trigger reviews_prevent_author_hidden_delete
before delete on public.reviews
for each row execute function public.prevent_author_deleting_hidden_review();
