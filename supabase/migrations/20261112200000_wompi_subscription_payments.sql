alter table public.subscription_settings
  add column if not exists checkout_enabled boolean not null default false;

update public.subscription_settings
set monthly_price_cop = 125000,
    payment_provider = 'wompi',
    renewal_enabled = false,
    checkout_enabled = false
where id = 1;

alter table public.subscription_settings
  drop constraint if exists subscription_checkout_configuration_complete;
alter table public.subscription_settings
  add constraint subscription_checkout_configuration_complete
  check (
    not checkout_enabled
    or (monthly_price_cop is not null and payment_provider = 'wompi')
  );

create table public.landlord_subscription_payments (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider = 'wompi'),
  provider_environment text not null check (provider_environment in ('test', 'prod')),
  reference text not null unique,
  provider_transaction_id text unique,
  subscription_terms_version text not null,
  subscription_terms_accepted_at timestamptz not null,
  amount_in_cents bigint not null check (amount_in_cents > 0),
  currency text not null check (currency = 'COP'),
  expires_at timestamptz not null,
  status text not null default 'checkout_created'
    check (status in ('checkout_created', 'pending', 'approved', 'declined', 'voided', 'error')),
  period_start_at timestamptz,
  period_end_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approved_subscription_payment_has_period
    check (
      status <> 'approved'
      or (
        paid_at is not null
        and period_start_at is not null
        and period_end_at > period_start_at
      )
    )
);

create index landlord_subscription_payments_owner_created_idx
  on public.landlord_subscription_payments (landlord_id, created_at desc);

alter table public.landlord_subscription_payments enable row level security;

drop policy if exists "Landlords and admins can view their subscription payments"
  on public.landlord_subscription_payments;
create policy "Landlords and admins can view their subscription payments"
on public.landlord_subscription_payments for select
to authenticated
using (
  landlord_id = (select auth.uid())
  or (select public.is_admin())
);

revoke all on public.landlord_subscription_payments from anon, authenticated;
grant select on public.landlord_subscription_payments to authenticated;
grant all on public.landlord_subscription_payments to service_role;

create or replace function public.apply_wompi_subscription_payment(
  p_reference text,
  p_transaction_id text,
  p_amount_in_cents bigint,
  p_currency text,
  p_status text,
  p_environment text
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  payment_row public.landlord_subscription_payments%rowtype;
  profile_created_at timestamptz;
  trial_ends_at timestamptz;
  current_paid_through timestamptz;
  period_start timestamptz;
  period_end timestamptz;
  approved_payment record;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Solo el servicio de pagos puede actualizar transacciones.';
  end if;

  if p_status not in ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR')
    or p_status is null
    or p_environment not in ('test', 'prod')
    or p_environment is null
    or p_currency is distinct from 'COP'
    or p_transaction_id is null
    or length(p_transaction_id) > 200 then
    raise exception 'Los datos de la transacción de Wompi no son válidos.';
  end if;

  select *
    into payment_row
    from public.landlord_subscription_payments
    where reference = p_reference
    for update;

  if not found then
    raise exception 'No existe un intento de pago para esta referencia.';
  end if;

  if payment_row.provider_environment is distinct from p_environment
    or payment_row.amount_in_cents is distinct from p_amount_in_cents
    or payment_row.currency is distinct from p_currency then
    raise exception 'El entorno o el valor de la transacción no coincide con el intento de pago.';
  end if;

  if payment_row.provider_transaction_id is not null
    and payment_row.provider_transaction_id is distinct from p_transaction_id then
    raise exception 'La referencia ya está asociada a otra transacción.';
  end if;

  if payment_row.status = 'approved' then
    if p_status <> 'VOIDED' then
      return payment_row.status;
    end if;

    select profile.created_at
      into profile_created_at
      from public.profiles as profile
      where profile.id = payment_row.landlord_id
        and profile.role = 'arrendador'
      for update;

    if profile_created_at is null then
      raise exception 'No se encontró el perfil de arrendador del pago.';
    end if;

    select greatest(profile_created_at, settings.launch_at)
        + make_interval(days => settings.trial_days)
      into trial_ends_at
      from public.subscription_settings as settings
      where settings.id = 1;

    if trial_ends_at is null then
      raise exception 'No está configurado el periodo de prueba de suscripción.';
    end if;

    update public.landlord_subscription_payments
      set status = 'voided',
          updated_at = now()
      where id = payment_row.id;

    period_start := trial_ends_at;
    for approved_payment in
      select id, paid_at
      from public.landlord_subscription_payments
      where landlord_id = payment_row.landlord_id
        and status = 'approved'
      order by paid_at, id
    loop
      period_start := greatest(period_start, approved_payment.paid_at);
      period_end := period_start + interval '1 month';
      update public.landlord_subscription_payments
        set period_start_at = period_start,
            period_end_at = period_end,
            updated_at = now()
        where id = approved_payment.id;
      period_start := period_end;
    end loop;

    insert into public.landlord_subscriptions (landlord_id, paid_through_at)
    values (payment_row.landlord_id, period_start)
    on conflict (landlord_id) do update
      set paid_through_at = excluded.paid_through_at,
          updated_at = now();

    return 'voided';
  end if;

  if p_status = 'APPROVED' then
    select profile.created_at
      into profile_created_at
      from public.profiles as profile
      where profile.id = payment_row.landlord_id
        and profile.role = 'arrendador'
      for update;

    if profile_created_at is null then
      raise exception 'No se encontró el perfil de arrendador del pago.';
    end if;

    select greatest(profile_created_at, settings.launch_at)
        + make_interval(days => settings.trial_days)
      into trial_ends_at
      from public.subscription_settings as settings
      where settings.id = 1;

    if trial_ends_at is null then
      raise exception 'No está configurado el periodo de prueba de suscripción.';
    end if;

    select subscription.paid_through_at
      into current_paid_through
      from public.landlord_subscriptions as subscription
      where subscription.landlord_id = payment_row.landlord_id
      for update;

    period_start := greatest(
      now(),
      trial_ends_at,
      coalesce(current_paid_through, '-infinity'::timestamptz)
    );
    period_end := period_start + interval '1 month';

    insert into public.landlord_subscriptions (landlord_id, paid_through_at)
    values (payment_row.landlord_id, period_end)
    on conflict (landlord_id) do update
      set paid_through_at = excluded.paid_through_at,
          updated_at = now();

    update public.landlord_subscription_payments
      set provider_transaction_id = p_transaction_id,
          status = 'approved',
          period_start_at = period_start,
          period_end_at = period_end,
          paid_at = now(),
          updated_at = now()
      where id = payment_row.id;

    return 'approved';
  end if;

  update public.landlord_subscription_payments
    set provider_transaction_id = p_transaction_id,
        status = lower(p_status),
        updated_at = now()
    where id = payment_row.id;

  return lower(p_status);
end;
$$;

revoke all on function public.apply_wompi_subscription_payment(text, text, bigint, text, text, text)
  from public, anon, authenticated;
grant execute on function public.apply_wompi_subscription_payment(text, text, bigint, text, text, text)
  to service_role;
