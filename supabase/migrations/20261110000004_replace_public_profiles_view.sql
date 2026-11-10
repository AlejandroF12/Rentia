drop view if exists public.public_profiles;

create or replace function public.get_public_profiles(p_user_ids uuid[])
returns table (id uuid, full_name text, municipality text, role public.app_role, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select profile.id, profile.full_name, profile.municipality, profile.role, profile.created_at
  from public.profiles as profile
  where profile.id = any(coalesce(p_user_ids, '{}'::uuid[]))
    and profile.status = 'activo'
    and profile.role <> 'admin'
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
grant execute on function public.get_public_profiles(uuid[]) to anon, authenticated;
