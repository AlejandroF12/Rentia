drop index if exists public.reviews_author_target_equipment_idx;
create unique index if not exists reviews_author_target_equipment_type_idx
  on public.reviews (author_id, target_user_id, equipment_id, review_type);

create or replace function public.enforce_review_participation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  author_role public.app_role;
  author_status public.account_status;
  target_role public.app_role;
  target_status public.account_status;
  equipment_owner_id uuid;
begin
  if tg_op = 'UPDATE' then
    if not public.is_admin() and (
      new.author_id is distinct from old.author_id
      or new.target_user_id is distinct from old.target_user_id
      or new.equipment_id is distinct from old.equipment_id
      or new.review_type is distinct from old.review_type
    ) then
      raise exception 'No puedes cambiar los participantes, el equipo ni el tipo de una valoración; edita su contenido.';
    end if;
    return new;
  end if;

  if new.author_id is distinct from auth.uid() then
    raise exception 'Solo puedes publicar una valoración en nombre de tu propia cuenta.';
  end if;

  select role, status
    into author_role, author_status
    from public.profiles
    where id = new.author_id;

  select role, status
    into target_role, target_status
    from public.profiles
    where id = new.target_user_id;

  select owner_id
    into equipment_owner_id
    from public.equipment
    where id = new.equipment_id;

  if author_status is distinct from 'activo'::public.account_status
    or target_status is distinct from 'activo'::public.account_status
    or equipment_owner_id is null then
    raise exception 'La valoración necesita cuentas activas y un equipo válido.';
  end if;

  if author_role = 'cliente'::public.app_role then
    if target_role is distinct from 'arrendador'::public.app_role
      or equipment_owner_id is distinct from new.target_user_id
      or new.review_type not in ('arrendador', 'equipo') then
      raise exception 'Un cliente solo puede valorar al arrendador o al equipo que pertenece a ese arrendador.';
    end if;
  elsif author_role = 'arrendador'::public.app_role then
    if target_role is distinct from 'cliente'::public.app_role
      or equipment_owner_id is distinct from new.author_id
      or new.review_type is distinct from 'arrendador' then
      raise exception 'Un arrendador solo puede valorar a un cliente en un equipo propio.';
    end if;

    if not exists (
      select 1
      from public.reviews
      where author_id = new.target_user_id
        and target_user_id = new.author_id
        and equipment_id = new.equipment_id
        and review_type = 'arrendador'
        and is_published
    ) then
      raise exception 'El cliente debe publicar primero una valoración visible sobre ti.';
    end if;
  else
    raise exception 'Solo clientes y arrendadores pueden publicar valoraciones.';
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_enforce_participation on public.reviews;
create trigger reviews_enforce_participation
before insert or update on public.reviews
for each row execute function public.enforce_review_participation();

revoke all on function public.enforce_review_participation() from public, anon, authenticated;

drop policy if exists "Authors and admins can delete reviews" on public.reviews;
create policy "Only admins can delete reviews"
on public.reviews for delete
to authenticated
using ((select public.is_admin()));
