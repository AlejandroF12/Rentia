alter table public.reviews
  add column if not exists review_type text not null default 'arrendador';

alter table public.reviews
  drop constraint if exists reviews_author_id_target_user_id_equipment_id_key;

alter table public.reviews
  add constraint reviews_review_type_valid check (review_type in ('arrendador', 'equipo'));

create unique index if not exists reviews_author_target_equipment_type_idx
  on public.reviews (author_id, target_user_id, equipment_id, review_type);
