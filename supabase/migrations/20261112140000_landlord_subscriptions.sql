create table public.subscription_settings (
  id smallint primary key default 1 check (id = 1),
  launch_at timestamptz not null default now(),
  trial_days integer not null default 30 check (trial_days between 1 and 365),
  billing_period text not null default 'mensual' check (billing_period = 'mensual'),
  monthly_price_cop bigint check (monthly_price_cop is null or monthly_price_cop > 0),
  payment_provider text,
  renewal_enabled boolean not null default false,
  constraint subscription_renewal_configuration_complete
    check (not renewal_enabled or (monthly_price_cop is not null and payment_provider is not null))
);

insert into public.subscription_settings (id, launch_at, trial_days, billing_period)
values (1, now(), 30, 'mensual')
on conflict (id) do nothing;

create table public.landlord_subscriptions (
  landlord_id uuid primary key references public.profiles(id) on delete cascade,
  paid_through_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscription_settings enable row level security;
alter table public.landlord_subscriptions enable row level security;

create policy "Authenticated users can view subscription settings"
on public.subscription_settings for select
to authenticated
using (true);

create policy "Landlords and admins can view subscription periods"
on public.landlord_subscriptions for select
to authenticated
using (landlord_id = (select auth.uid()) or (select public.is_admin()));

revoke all on public.subscription_settings from anon, authenticated;
grant select on public.subscription_settings to authenticated;
revoke all on public.landlord_subscriptions from anon, authenticated;
grant select on public.landlord_subscriptions to authenticated;

create or replace function public.has_active_landlord_subscription(p_landlord_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles as profile
    join public.subscription_settings as settings on settings.id = 1
    left join public.landlord_subscriptions as subscription
      on subscription.landlord_id = profile.id
    where profile.id = p_landlord_id
      and profile.role = 'arrendador'
      and (
        greatest(profile.created_at, settings.launch_at)
          + make_interval(days => settings.trial_days) > now()
        or subscription.paid_through_at > now()
      )
  );
$$;

revoke all on function public.has_active_landlord_subscription(uuid) from public;
grant execute on function public.has_active_landlord_subscription(uuid) to anon, authenticated;

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
      and (
        role <> 'arrendador'
        or public.has_active_landlord_subscription(id)
      )
  );
$$;

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
      and public.has_active_landlord_subscription(profiles.id)
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
      and public.has_active_landlord_subscription(profiles.id)
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
      and (
        author.role <> 'arrendador'
        or public.has_active_landlord_subscription(author.id)
      )
      and (
        target.role <> 'arrendador'
        or public.has_active_landlord_subscription(target.id)
      )
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

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (
  (id = (select auth.uid()) and (select public.is_current_profile_active()))
  or (select public.is_admin())
)
with check (
  (id = (select auth.uid()) and (select public.is_current_profile_active()))
  or (select public.is_admin())
);

drop policy if exists "Anonymous users can view public profiles" on public.profiles;
create policy "Anonymous users can view public profiles"
on public.profiles for select
to anon
using (
  status = 'activo'
  and role <> 'admin'
  and (
    role <> 'arrendador'
    or public.has_active_landlord_subscription(id)
  )
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

create or replace view public.public_profiles
with (security_barrier = true)
as
select id, full_name, municipality, role, created_at
from public.profiles
where status = 'activo'
  and role <> 'admin'
  and (
    role <> 'arrendador'
    or public.has_active_landlord_subscription(id)
  )
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
    and profile.contact_authorized
    and public.has_active_landlord_subscription(profile.id)
    and exists (
      select 1
      from public.equipment as item
      where item.owner_id = profile.id
        and item.publication_status = 'publicada'
        and public.is_equipment_public(item.id)
    );
$$;
