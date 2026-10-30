create extension if not exists "postgis" with schema extensions;

alter table public.equipment
  add column if not exists location extensions.geography(POINT, 4326);

create index if not exists equipment_location_idx
  on public.equipment using gist (location);

create or replace function public.sync_equipment_location()
returns trigger
language plpgsql
security invoker
set search_path = public, extensions
as $$
begin
  if new.latitude is null or new.longitude is null then
    new.location = null;
  else
    new.location = extensions.st_setsrid(
      extensions.st_makepoint(new.longitude, new.latitude),
      4326
    )::extensions.geography;
  end if;
  return new;
end;
$$;

drop trigger if exists equipment_sync_location on public.equipment;

create trigger equipment_sync_location
before insert or update of latitude, longitude on public.equipment
for each row execute function public.sync_equipment_location();

update public.equipment
set location = extensions.st_setsrid(
  extensions.st_makepoint(longitude, latitude),
  4326
)::extensions.geography
where latitude is not null
  and longitude is not null;

create or replace function public.nearby_equipment(
  p_latitude numeric,
  p_longitude numeric,
  p_radius_km numeric default 150
)
returns setof public.equipment
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select equipment.*
  from public.equipment
  where equipment.publication_status = 'publicada'
    and equipment.location is not null
    and p_radius_km >= 0
    and extensions.st_dwithin(
      equipment.location,
      extensions.st_setsrid(
        extensions.st_makepoint(p_longitude, p_latitude),
        4326
      )::extensions.geography,
      p_radius_km * 1000
    )
  order by extensions.st_distance(
    equipment.location,
    extensions.st_setsrid(
      extensions.st_makepoint(p_longitude, p_latitude),
      4326
    )::extensions.geography
  );
$$;

create or replace function public.limit_equipment_images()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (
    select count(*)
    from public.equipment_images
    where equipment_id = new.equipment_id
  ) >= 8 then
    raise exception 'Un equipo no puede tener más de 8 imágenes';
  end if;
  return new;
end;
$$;

drop trigger if exists equipment_images_limit on public.equipment_images;

create trigger equipment_images_limit
before insert on public.equipment_images
for each row execute function public.limit_equipment_images();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'equipment-images',
  'equipment-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
    where equipment.id::text = split_part(name, '/', 1)
      and equipment.owner_id = auth.uid()
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
    where equipment.id::text = split_part(name, '/', 1)
      and equipment.owner_id = auth.uid()
  )
)
with check (
  bucket_id = 'equipment-images'
  and exists (
    select 1
    from public.equipment
    where equipment.id::text = split_part(name, '/', 1)
      and equipment.owner_id = auth.uid()
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
    where equipment.id::text = split_part(name, '/', 1)
      and equipment.owner_id = auth.uid()
  )
);
