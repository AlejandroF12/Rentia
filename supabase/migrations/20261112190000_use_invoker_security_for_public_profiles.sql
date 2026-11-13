grant select (status) on public.profiles to anon;

alter view public.public_profiles
  set (security_invoker = true);
