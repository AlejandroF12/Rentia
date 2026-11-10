drop policy if exists "Users and admins can view private profiles" on public.profiles;
create policy "Users and admins can view private profiles"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()) or (select public.is_admin()))
with check (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Published equipment is public" on public.equipment;
create policy "Published equipment is public"
on public.equipment for select
to anon, authenticated
using (
  publication_status = 'publicada'
  or owner_id = (select auth.uid())
  or (select public.is_admin())
);

drop policy if exists "Owners can create equipment" on public.equipment;
create policy "Owners can create equipment"
on public.equipment for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select role from public.profiles where id = (select auth.uid())) = 'arrendador'
);

drop policy if exists "Owners and admins can update equipment" on public.equipment;
create policy "Owners and admins can update equipment"
on public.equipment for update
to authenticated
using (owner_id = (select auth.uid()) or (select public.is_admin()))
with check (owner_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Published equipment images are public" on public.equipment_images;
create policy "Published equipment images are public"
on public.equipment_images for select
to anon, authenticated
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

drop policy if exists "Owners can manage equipment images" on public.equipment_images;
create policy "Owners can manage equipment images"
on public.equipment_images for all
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

drop policy if exists "Users manage their favorites" on public.favorites;
create policy "Users manage their favorites"
on public.favorites for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Published reviews are public" on public.reviews;
create policy "Published reviews are public"
on public.reviews for select
to anon, authenticated
using (
  is_published
  or author_id = (select auth.uid())
  or target_user_id = (select auth.uid())
  or (select public.is_admin())
);

drop policy if exists "Users can create their reviews" on public.reviews;
create policy "Users can create their reviews"
on public.reviews for insert
to authenticated
with check (author_id = (select auth.uid()));

drop policy if exists "Authors can update their reviews" on public.reviews;
create policy "Authors can update their reviews"
on public.reviews for update
to authenticated
using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Authors and admins can delete reviews" on public.reviews;
create policy "Authors and admins can delete reviews"
on public.reviews for delete
to authenticated
using (author_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users can create reports" on public.reports;
create policy "Users can create reports"
on public.reports for insert
to authenticated
with check (reporter_id = (select auth.uid()));

drop policy if exists "Users can view their reports" on public.reports;
create policy "Users can view their reports"
on public.reports for select
to authenticated
using (reporter_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins can manage reports" on public.reports;
create policy "Admins can manage reports"
on public.reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Users manage their contact authorizations" on public.contact_authorizations;
create policy "Users manage their contact authorizations"
on public.contact_authorizations for all
to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()))
with check (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Users can view their account appeals" on public.account_appeals;
create policy "Users can view their account appeals"
on public.account_appeals for select
to authenticated
using (appellant_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Suspended users can submit account appeals" on public.account_appeals;
create policy "Suspended users can submit account appeals"
on public.account_appeals for insert
to authenticated
with check (
  appellant_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and status = 'suspendido'
  )
);

drop policy if exists "Owners can upload equipment images" on storage.objects;
create policy "Owners can upload equipment images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and equipment.owner_id = (select auth.uid())
  )
);

drop policy if exists "Owners can update equipment images" on storage.objects;
create policy "Owners can update equipment images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and equipment.owner_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and equipment.owner_id = (select auth.uid())
  )
);

drop policy if exists "Owners can delete equipment images" on storage.objects;
create policy "Owners can delete equipment images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and equipment.owner_id = (select auth.uid())
  )
);
