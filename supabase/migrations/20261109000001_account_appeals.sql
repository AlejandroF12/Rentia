create table public.account_appeals (
  id uuid primary key default gen_random_uuid(),
  appellant_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  description text not null,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aceptada', 'rechazada')),
  decision_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint account_appeals_reason_length check (char_length(reason) between 3 and 100),
  constraint account_appeals_description_length check (char_length(description) between 30 and 2000),
  constraint account_appeals_decision_note_length check (decision_note is null or char_length(decision_note) <= 2000)
);

create unique index account_appeals_one_pending_per_user_idx
  on public.account_appeals (appellant_id)
  where status = 'pendiente';

create index account_appeals_status_created_idx
  on public.account_appeals (status, created_at desc);

alter table public.profiles
  add column suspension_reason text,
  add column suspended_at timestamptz,
  add column suspended_by uuid references public.profiles(id) on delete set null;

alter table public.account_appeals enable row level security;

create policy "Users can view their account appeals"
on public.account_appeals for select
to authenticated
using (appellant_id = auth.uid() or public.is_admin());

create policy "Suspended users can submit account appeals"
on public.account_appeals for insert
to authenticated
with check (
  appellant_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'suspendido'
  )
);

grant select, insert on public.account_appeals to authenticated;

create or replace function public.prevent_non_admin_account_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and (
    old.status is distinct from new.status
    or old.suspension_reason is distinct from new.suspension_reason
    or old.suspended_at is distinct from new.suspended_at
    or old.suspended_by is distinct from new.suspended_by
  ) then
    raise exception 'Solo administración puede cambiar el estado o el motivo de suspensión de una cuenta';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_non_admin_status_change
before update on public.profiles
for each row execute function public.prevent_non_admin_account_status_change();

create or replace function public.resolve_account_appeal(
  p_appeal_id uuid,
  p_decision text,
  p_decision_note text
)
returns public.account_appeals
language plpgsql
security definer
set search_path = public
as $$
declare
  appeal public.account_appeals;
  note text := btrim(coalesce(p_decision_note, ''));
begin
  if not public.is_admin() then
    raise exception 'No tienes permiso para resolver apelaciones';
  end if;
  if p_decision is null or p_decision not in ('aceptada', 'rechazada') then
    raise exception 'La decisión de apelación no es válida';
  end if;
  if char_length(note) < 10 or char_length(note) > 2000 then
    raise exception 'La nota de decisión debe tener entre 10 y 2000 caracteres';
  end if;

  select *
    into appeal
    from public.account_appeals
    where id = p_appeal_id
    for update;

  if not found then
    raise exception 'No se encontró la apelación';
  end if;
  if appeal.status <> 'pendiente' then
    raise exception 'La apelación ya fue resuelta';
  end if;

  update public.account_appeals
    set status = p_decision,
        decision_note = note,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    where id = p_appeal_id
    returning * into appeal;

  if p_decision = 'aceptada' then
    update public.profiles
      set status = 'activo'
      where id = appeal.appellant_id
        and status = 'suspendido';
    if not found then
      raise exception 'La cuenta ya no está suspendida y no se puede reactivar con esta apelación';
    end if;
  end if;

  return appeal;
end;
$$;

revoke all on function public.resolve_account_appeal(uuid, text, text) from public;
grant execute on function public.resolve_account_appeal(uuid, text, text) to authenticated;
