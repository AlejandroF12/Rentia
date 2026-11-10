create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role public.app_role;
  contact_authorized boolean;
begin
  selected_role := case
    when new.raw_user_meta_data ->> 'role' = 'arrendador' then 'arrendador'::public.app_role
    else 'cliente'::public.app_role
  end;
  contact_authorized := selected_role = 'arrendador'
    and new.raw_user_meta_data ->> 'contact_authorized' = 'true';

  insert into public.profiles (id, full_name, email, phone, role, contact_authorized)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    selected_role,
    contact_authorized
  );
  return new;
end;
$$;
