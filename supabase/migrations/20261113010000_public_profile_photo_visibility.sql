create or replace function public.can_view_profile_photo(p_owner_folder text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  owner_id uuid;
  viewer_can_view boolean;
begin
  if p_owner_folder is null
    or p_owner_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return false;
  end if;

  owner_id := p_owner_folder::uuid;
  if auth.uid() is null then
    viewer_can_view := true;
  else
    viewer_can_view := public.is_current_profile_active();
  end if;

  return exists (
    select 1
    from public.profiles as profile
    where profile.id = owner_id
      and (
        profile.id = auth.uid()
        or (
          viewer_can_view
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
grant execute on function public.can_view_profile_photo(text) to anon, authenticated;

drop policy if exists "Authenticated users can view profile photos" on storage.objects;
drop policy if exists "Public profiles can view profile photos" on storage.objects;
create policy "Public profiles can view profile photos"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'profile-photos'
  and public.can_view_profile_photo((storage.foldername(name))[1])
);

grant execute on function public.get_public_profiles(uuid[]) to anon;
