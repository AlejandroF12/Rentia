alter table public.reviews
  add column if not exists highlighted_aspects text[] not null default '{}';

grant update on table public.reviews to authenticated;

update public.reviews
set
  highlighted_aspects = array(
    select trim(aspect)
    from regexp_split_to_table(
      substring(comment from '^Aspectos destacados: (.*?)(?:\. ?|$)'),
      ','
    ) as aspect
    where trim(aspect) <> ''
  ),
  comment = regexp_replace(comment, '^Aspectos destacados: .*?\. ?', '')
where comment like 'Aspectos destacados:%';
