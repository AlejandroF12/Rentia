# Rentia
Desarrollo de una plataforma web para la gestión del alquiler de maquinaria, equipos industriales y vehículos de carga en Yopal y municipios cercanos de Casanare

## Base de datos y autenticación

La aplicación usa Supabase como base para PostgreSQL, autenticación, almacenamiento de imágenes y Row Level Security.

Las migraciones se encuentran en [`supabase/migrations`](./supabase/migrations). Deben ejecutarse en orden desde el SQL Editor de Supabase o con la CLI:

```bash
npx supabase db push
```

En particular, [`20261105000000_add_review_highlights.sql`](./supabase/migrations/20261105000000_add_review_highlights.sql) agrega `reviews.highlighted_aspects`, [`20261106000000_split_review_types.sql`](./supabase/migrations/20261106000000_split_review_types.sql) separa las valoraciones de arrendador y equipo y [`20261107000000_dedupe_reviews.sql`](./supabase/migrations/20261107000000_dedupe_reviews.sql) elimina duplicados históricos y refuerza la unicidad. Si la aplicación muestra que alguna columna no existe, las migraciones aún no se han aplicado al proyecto Supabase conectado; ejecuta `npx supabase db push` o los archivos pendientes en el SQL Editor. Después de aplicarlas, recarga el esquema de la API o espera unos segundos para que PostgREST actualice su caché.

La migración crea:

- perfiles y roles `cliente`, `arrendador` y `admin`;
- publicaciones, imágenes y estados de moderación;
- favoritos, valoraciones, reportes y autorizaciones de contacto;
- políticas RLS para separar permisos por rol.

El trigger de registro crea automáticamente un perfil para cada usuario nuevo de Supabase Auth. El rol inicial solo puede ser `cliente` o `arrendador`; la promoción a `admin` debe hacerse de forma controlada desde el panel de Supabase.