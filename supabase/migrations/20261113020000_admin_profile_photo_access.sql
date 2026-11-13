drop policy if exists "Admins can view profile photos" on storage.objects;
create policy "Admins can view profile photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'profile-photos'
  and (select public.is_admin())
);
