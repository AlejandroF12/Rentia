drop policy if exists "Owners can upload equipment images" on storage.objects;
drop policy if exists "Owners can update equipment images" on storage.objects;
drop policy if exists "Owners can delete equipment images" on storage.objects;

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
