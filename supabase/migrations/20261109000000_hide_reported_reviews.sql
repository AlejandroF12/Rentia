create or replace function public.hide_reported_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.review_id is not null then
    update public.reviews
    set is_published = false
    where id = new.review_id;
  end if;
  return new;
end;
$$;

drop trigger if exists reports_hide_review on public.reports;

create trigger reports_hide_review
after insert on public.reports
for each row execute function public.hide_reported_review();

update public.reviews as r
set is_published = false
where r.is_published
  and exists (
    select 1
    from public.reports as rep
    where rep.review_id = r.id
      and rep.status <> 'resuelto'
  );
