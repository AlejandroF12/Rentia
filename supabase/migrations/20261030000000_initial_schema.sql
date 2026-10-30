create extension if not exists "pgcrypto";
create extension if not exists "postgis" with schema extensions;

create type public.app_role as enum ('cliente', 'arrendador', 'admin');
create type public.account_status as enum ('activo', 'suspendido', 'eliminado');
create type public.publication_status as enum ('borrador', 'revision', 'publicada', 'oculta', 'suspendida', 'eliminada');
create type public.report_status as enum ('pendiente', 'revision', 'resuelto');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  municipality text,
  role public.app_role not null default 'cliente',
  status public.account_status not null default 'activo',
  contact_authorized boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) between 2 and 120),
  constraint profiles_phone_length check (phone is null or char_length(phone) between 7 and 30)
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  name text not null,
  category text not null,
  brand text,
  model text,
  model_year integer,
  main_feature text,
  description text not null,
  municipality text not null,
  sector text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  location extensions.geography(POINT, 4326),
  is_available boolean not null default true,
  publication_status public.publication_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_name_length check (char_length(name) between 2 and 160),
  constraint equipment_description_length check (char_length(description) between 10 and 3000),
  constraint equipment_model_year_valid check (model_year is null or model_year between 1900 and 2100),
  constraint equipment_coordinates_pair check ((latitude is null and longitude is null) or (latitude is not null and longitude is not null)),
  constraint equipment_latitude_valid check (latitude is null or latitude between -90 and 90),
  constraint equipment_longitude_valid check (longitude is null or longitude between -180 and 180)
);

create table public.equipment_images (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  storage_path text not null unique,
  display_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  constraint equipment_images_order_valid check (display_order >= 0)
);

create unique index equipment_one_cover_image_idx
  on public.equipment_images (equipment_id)
  where is_cover;

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, equipment_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  target_user_id uuid not null references public.profiles(id) on delete restrict,
  equipment_id uuid not null references public.equipment(id) on delete restrict,
  rating smallint not null,
  comment text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_rating_valid check (rating between 1 and 5),
  constraint reviews_participants_differ check (author_id <> target_user_id),
  unique (author_id, target_user_id, equipment_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  equipment_id uuid references public.equipment(id) on delete restrict,
  review_id uuid references public.reviews(id) on delete restrict,
  reason text not null,
  description text,
  status public.report_status not null default 'pendiente',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  resolution_note text,
  created_at timestamptz not null default now(),
  constraint reports_target_present check (equipment_id is not null or review_id is not null),
  constraint reports_description_length check (description is null or char_length(description) <= 500)
);

create table public.contact_authorizations (
  user_id uuid not null references public.profiles(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  authorized boolean not null default false,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (user_id, equipment_id)
);

create index equipment_publication_idx on public.equipment (publication_status, municipality);
create index equipment_owner_idx on public.equipment (owner_id);
create index equipment_category_idx on public.equipment (category);
create index equipment_location_idx on public.equipment using gist (location);
create index equipment_images_equipment_idx on public.equipment_images (equipment_id, display_order);
create index reviews_target_idx on public.reviews (target_user_id, is_published);
create index reports_status_idx on public.reports (status, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create trigger equipment_sync_location
before insert or update of latitude, longitude on public.equipment
for each row execute function public.sync_equipment_location();

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
    and extensions.st_dwithin(
      equipment.location,
      extensions.st_setsrid(extensions.st_makepoint(p_longitude, p_latitude), 4326)::extensions.geography,
      p_radius_km * 1000
    )
  order by extensions.st_distance(
    equipment.location,
    extensions.st_setsrid(extensions.st_makepoint(p_longitude, p_latitude), 4326)::extensions.geography
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

create trigger equipment_images_limit
before insert on public.equipment_images
for each row execute function public.limit_equipment_images();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger equipment_set_updated_at
before update on public.equipment
for each row execute function public.set_updated_at();

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
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
      and role = 'admin'
      and status = 'activo'
  );
$$;

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin() then
    raise exception 'No tienes permiso para cambiar el rol';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_role_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    case
      when new.raw_user_meta_data ->> 'role' = 'arrendador' then 'arrendador'::public.app_role
      else 'cliente'::public.app_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.equipment enable row level security;
alter table public.equipment_images enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.contact_authorizations enable row level security;

create policy "Profiles are visible to authenticated users"
on public.profiles for select
to authenticated
using (status <> 'eliminado' or id = auth.uid() or public.is_admin());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Published equipment is public"
on public.equipment for select
to anon, authenticated
using (
  publication_status = 'publicada'
  or owner_id = auth.uid()
  or public.is_admin()
);

create policy "Owners can create equipment"
on public.equipment for insert
to authenticated
with check (owner_id = auth.uid() and (select role from public.profiles where id = auth.uid()) = 'arrendador');

create policy "Owners and admins can update equipment"
on public.equipment for update
to authenticated
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

create policy "Owners and admins can delete equipment"
on public.equipment for delete
to authenticated
using (owner_id = auth.uid() or public.is_admin());

create policy "Published equipment images are public"
on public.equipment_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.publication_status = 'publicada' or equipment.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "Owners can manage equipment images"
on public.equipment_images for all
to authenticated
using (
  exists (
    select 1 from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.equipment
    where equipment.id = equipment_images.equipment_id
      and (equipment.owner_id = auth.uid() or public.is_admin())
  )
);

create policy "Users manage their favorites"
on public.favorites for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Published reviews are public"
on public.reviews for select
to anon, authenticated
using (is_published or author_id = auth.uid() or target_user_id = auth.uid() or public.is_admin());

create policy "Users can create their reviews"
on public.reviews for insert
to authenticated
with check (author_id = auth.uid());

create policy "Authors can update their reviews"
on public.reviews for update
to authenticated
using (author_id = auth.uid() or public.is_admin())
with check (author_id = auth.uid() or public.is_admin());

create policy "Authors and admins can delete reviews"
on public.reviews for delete
to authenticated
using (author_id = auth.uid() or public.is_admin());

create policy "Users can create reports"
on public.reports for insert
to authenticated
with check (reporter_id = auth.uid());

create policy "Users can view their reports"
on public.reports for select
to authenticated
using (reporter_id = auth.uid() or public.is_admin());

create policy "Admins can manage reports"
on public.reports for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users manage their contact authorizations"
on public.contact_authorizations for all
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

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
