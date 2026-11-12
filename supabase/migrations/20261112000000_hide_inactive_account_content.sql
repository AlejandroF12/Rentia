create or replace function public.is_equipment_public(p_equipment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.equipment
    join public.profiles on profiles.id = equipment.owner_id
    where equipment.id = p_equipment_id
      and equipment.publication_status = 'publicada'
      and profiles.status = 'activo'
  );
$$;

create or replace function public.is_equipment_owner_active(p_equipment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.equipment
    join public.profiles on profiles.id = equipment.owner_id
    where equipment.id = p_equipment_id
      and equipment.owner_id = auth.uid()
      and profiles.status = 'activo'
  );
$$;

create or replace function public.is_current_profile_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'activo'
  );
$$;

create or replace function public.is_review_public(p_review_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.reviews
    join public.profiles as author on author.id = reviews.author_id
    join public.profiles as target on target.id = reviews.target_user_id
    where reviews.id = p_review_id
      and reviews.is_published
      and author.status = 'activo'
      and target.status = 'activo'
  );
$$;

revoke all on function public.is_equipment_public(uuid) from public, anon, authenticated;
grant execute on function public.is_equipment_public(uuid) to anon, authenticated;
revoke all on function public.is_equipment_owner_active(uuid) from public, anon, authenticated;
grant execute on function public.is_equipment_owner_active(uuid) to authenticated;
revoke all on function public.is_current_profile_active() from public, anon, authenticated;
grant execute on function public.is_current_profile_active() to authenticated;
revoke all on function public.is_review_public(uuid) from public, anon, authenticated;
grant execute on function public.is_review_public(uuid) to anon, authenticated;

drop policy if exists "Anonymous users can view published equipment" on public.equipment;
create policy "Anonymous users can view published equipment"
on public.equipment for select
to anon
using (public.is_equipment_public(id));

drop policy if exists "Authenticated users can view published equipment" on public.equipment;
create policy "Authenticated users can view published equipment"
on public.equipment for select
to authenticated
using (
  public.is_equipment_public(id)
  or (
    owner_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
);

drop policy if exists "Owners can create equipment" on public.equipment;
create policy "Owners can create equipment"
on public.equipment for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (select public.is_current_profile_active())
  and (select role from public.profiles where id = (select auth.uid())) = 'arrendador'
);

drop policy if exists "Owners and admins can update equipment" on public.equipment;
create policy "Owners and admins can update equipment"
on public.equipment for update
to authenticated
using (
  (
    owner_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
)
with check (
  (
    owner_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
);

drop policy if exists "Owners and admins can delete equipment" on public.equipment;
create policy "Owners and admins can delete equipment"
on public.equipment for delete
to authenticated
using (
  (
    owner_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
);

drop policy if exists "Anonymous users can view published equipment images" on public.equipment_images;
create policy "Anonymous users can view published equipment images"
on public.equipment_images for select
to anon
using (public.is_equipment_public(equipment_id));

drop policy if exists "Authenticated users can view published equipment images" on public.equipment_images;
create policy "Authenticated users can view published equipment images"
on public.equipment_images for select
to authenticated
using (
  public.is_equipment_public(equipment_id)
  or public.is_equipment_owner_active(equipment_id)
  or (select public.is_admin())
);

drop policy if exists "Owners can insert equipment images" on public.equipment_images;
create policy "Owners can insert equipment images"
on public.equipment_images for insert
to authenticated
with check (
  public.is_equipment_owner_active(equipment_id)
  or (select public.is_admin())
);

drop policy if exists "Owners can update equipment images" on public.equipment_images;
create policy "Owners can update equipment images"
on public.equipment_images for update
to authenticated
using (
  public.is_equipment_owner_active(equipment_id)
  or (select public.is_admin())
)
with check (
  public.is_equipment_owner_active(equipment_id)
  or (select public.is_admin())
);

drop policy if exists "Owners can delete equipment images" on public.equipment_images;
create policy "Owners can delete equipment images"
on public.equipment_images for delete
to authenticated
using (
  public.is_equipment_owner_active(equipment_id)
  or (select public.is_admin())
);

drop policy if exists "Anonymous users can view published reviews" on public.reviews;
create policy "Anonymous users can view published reviews"
on public.reviews for select
to anon
using (public.is_review_public(id));

drop policy if exists "Authenticated users can view published reviews" on public.reviews;
create policy "Authenticated users can view published reviews"
on public.reviews for select
to authenticated
using (public.is_review_public(id) or (select public.is_admin()));

drop policy if exists "Users can create their reviews" on public.reviews;
create policy "Users can create their reviews"
on public.reviews for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select public.is_current_profile_active())
);

drop policy if exists "Authors can update their reviews" on public.reviews;
create policy "Authors can update their reviews"
on public.reviews for update
to authenticated
using (
  (author_id = (select auth.uid()) and public.is_review_public(id))
  or (select public.is_admin())
)
with check (
  (author_id = (select auth.uid()) and public.is_current_profile_active())
  or (select public.is_admin())
);

drop policy if exists "Authors and admins can delete reviews" on public.reviews;
create policy "Authors and admins can delete reviews"
on public.reviews for delete
to authenticated
using (
  (author_id = (select auth.uid()) and public.is_current_profile_active())
  or (select public.is_admin())
);

drop policy if exists "Users can view their reports" on public.reports;
create policy "Users can view their reports"
on public.reports for select
to authenticated
using (
  (reporter_id = (select auth.uid()) and (select public.is_current_profile_active()))
  or (select public.is_admin())
);

drop policy if exists "Users can create reports" on public.reports;
create policy "Users can create reports"
on public.reports for insert
to authenticated
with check (
  reporter_id = (select auth.uid())
  and (select public.is_current_profile_active())
);

drop policy if exists "Users manage their favorites" on public.favorites;
create policy "Users manage their favorites"
on public.favorites for all
to authenticated
using (
  user_id = (select auth.uid())
  and (select public.is_current_profile_active())
)
with check (
  user_id = (select auth.uid())
  and (select public.is_current_profile_active())
);

drop policy if exists "Users manage their contact authorizations" on public.contact_authorizations;
create policy "Users manage their contact authorizations"
on public.contact_authorizations for all
to authenticated
using (
  (
    user_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
)
with check (
  (
    user_id = (select auth.uid())
    and (select public.is_current_profile_active())
  )
  or (select public.is_admin())
);

update storage.buckets
set public = false
where id = 'equipment-images';

drop policy if exists "Anonymous users can view active equipment images" on storage.objects;
create policy "Anonymous users can view active equipment images"
on storage.objects for select
to anon
using (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and public.is_equipment_public(equipment.id)
  )
);

drop policy if exists "Authenticated users can view active equipment images" on storage.objects;
create policy "Authenticated users can view active equipment images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'equipment-images'
  and (
    exists (
      select 1
      from public.equipment
      where equipment.id::text = split_part(storage.objects.name, '/', 1)
        and public.is_equipment_public(equipment.id)
    )
    or exists (
      select 1
      from public.equipment
      where equipment.id::text = split_part(storage.objects.name, '/', 1)
        and public.is_equipment_owner_active(equipment.id)
    )
    or (select public.is_admin())
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
      and public.is_equipment_owner_active(equipment.id)
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
      and public.is_equipment_owner_active(equipment.id)
  )
)
with check (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(storage.objects.name, '/', 1)
      and public.is_equipment_owner_active(equipment.id)
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
      and public.is_equipment_owner_active(equipment.id)
  )
);
