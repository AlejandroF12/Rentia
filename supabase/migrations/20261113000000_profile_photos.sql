alter table public.profiles
  add column if not exists avatar_path text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_avatar_path_owned'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_avatar_path_owned
      check (
        avatar_path is null
        or (
          split_part(avatar_path, '/', 1) = id::text
          and char_length(avatar_path) <= 300
        )
      );
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_view_profile_photo(p_owner_folder text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  owner_id uuid;
begin
  if auth.uid() is null
    or p_owner_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return false;
  end if;

  owner_id := p_owner_folder::uuid;

  return exists (
    select 1
    from public.profiles as profile
    where profile.id = owner_id
      and (
        profile.id = auth.uid()
        or (
          public.is_current_profile_active()
          and profile.status = 'activo'
          and profile.role <> 'admin'
          and (
            profile.role <> 'arrendador'
            or public.has_active_landlord_subscription(profile.id)
          )
          and (
            exists (
              select 1
              from public.equipment as item
              where item.owner_id = profile.id
                and item.publication_status = 'publicada'
            )
            or exists (
              select 1
              from public.reviews as review
              where review.author_id = profile.id
                and review.is_published
            )
            or exists (
              select 1
              from public.reviews as review
              where review.target_user_id = profile.id
                and review.is_published
            )
          )
        )
      )
  );
end;
$$;

revoke all on function public.can_view_profile_photo(text) from public, anon, authenticated;
grant execute on function public.can_view_profile_photo(text) to authenticated;

drop policy if exists "Authenticated users can view profile photos" on storage.objects;
create policy "Authenticated users can view profile photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'profile-photos'
  and public.can_view_profile_photo((storage.foldername(name))[1])
);

drop policy if exists "Users can upload their own profile photos" on storage.objects;
create policy "Users can upload their own profile photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_current_profile_active())
);

drop policy if exists "Users can delete their own profile photos" on storage.objects;
create policy "Users can delete their own profile photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (select public.is_current_profile_active())
);

drop function if exists public.get_public_profiles(uuid[]);
create function public.get_public_profiles(p_user_ids uuid[])
returns table (
  id uuid,
  full_name text,
  municipality text,
  role public.app_role,
  created_at timestamptz,
  avatar_path text
)
language sql
stable
security definer
set search_path = public
as $$
  select profile.id, profile.full_name, profile.municipality, profile.role, profile.created_at, profile.avatar_path
  from public.profiles as profile
  where profile.id = any(coalesce(p_user_ids, '{}'::uuid[]))
    and profile.status = 'activo'
    and profile.role <> 'admin'
    and (
      profile.role <> 'arrendador'
      or public.has_active_landlord_subscription(profile.id)
    )
    and (
      exists (
        select 1
        from public.equipment as item
        where item.owner_id = profile.id
          and item.publication_status = 'publicada'
      )
      or exists (
        select 1
        from public.reviews as review
        where review.author_id = profile.id
          and review.is_published
      )
      or exists (
        select 1
        from public.reviews as review
        where review.target_user_id = profile.id
          and review.is_published
      )
    );
$$;

revoke all on function public.get_public_profiles(uuid[]) from public, anon;
grant execute on function public.get_public_profiles(uuid[]) to authenticated;
