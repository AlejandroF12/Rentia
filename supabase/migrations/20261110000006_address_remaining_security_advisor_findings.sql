drop policy if exists "Admins can manage profiles" on public.profiles;

grant select (id, full_name, municipality, role, created_at) on public.profiles to anon;

drop policy if exists "Anonymous users can view public profiles" on public.profiles;
create policy "Anonymous users can view public profiles"
on public.profiles for select
to anon
using (
  status = 'activo'
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
  )
);

revoke all on function public.get_public_profiles(uuid[]) from public, anon;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;

drop policy if exists "Published equipment is public" on public.equipment;
create policy "Anonymous users can view published equipment"
on public.equipment for select
to anon
using (publication_status = 'publicada');

create policy "Authenticated users can view published equipment"
on public.equipment for select
to authenticated
using (
  publication_status = 'publicada'
  or owner_id = (select auth.uid())
  or (select public.is_admin())
);

drop policy if exists "Published equipment images are public" on public.equipment_images;
create policy "Anonymous users can view published equipment images"
on public.equipment_images for select
to anon
using (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and equipment.publication_status = 'publicada'
  )
);

create policy "Authenticated users can view published equipment images"
on public.equipment_images for select
to authenticated
using (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (
        equipment.publication_status = 'publicada'
        or equipment.owner_id = (select auth.uid())
        or (select public.is_admin())
      )
  )
);

drop policy if exists "Published reviews are public" on public.reviews;
create policy "Anonymous users can view published reviews"
on public.reviews for select
to anon
using (is_published);

create policy "Authenticated users can view published reviews"
on public.reviews for select
to authenticated
using (
  is_published
  or author_id = (select auth.uid())
  or target_user_id = (select auth.uid())
  or (select public.is_admin())
);

drop policy if exists "Owners can manage equipment images" on public.equipment_images;

create policy "Owners can insert equipment images"
on public.equipment_images for insert
to authenticated
with check (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = (select auth.uid()) or (select public.is_admin()))
  )
);

create policy "Owners can update equipment images"
on public.equipment_images for update
to authenticated
using (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = (select auth.uid()) or (select public.is_admin()))
  )
)
with check (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = (select auth.uid()) or (select public.is_admin()))
  )
);

create policy "Owners can delete equipment images"
on public.equipment_images for delete
to authenticated
using (
  exists (
    select 1
    from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = (select auth.uid()) or (select public.is_admin()))
  )
);

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.prevent_role_escalation() from public, anon, authenticated;
revoke all on function public.prevent_non_admin_account_status_change() from public, anon, authenticated;
revoke all on function public.prevent_owner_moderated_equipment_status_change() from public, anon, authenticated;
revoke all on function public.prevent_author_review_moderation_changes() from public, anon, authenticated;
revoke all on function public.prevent_author_deleting_hidden_review() from public, anon, authenticated;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.get_public_equipment_owner(uuid) from public, anon;
grant execute on function public.get_public_equipment_owner(uuid) to authenticated;

revoke all on function public.resolve_account_appeal(uuid, text, text) from public, anon;
grant execute on function public.resolve_account_appeal(uuid, text, text) to authenticated;
