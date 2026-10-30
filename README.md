# Rentia
Desarrollo de una plataforma web para la gestión del alquiler de maquinaria, equipos industriales y vehículos de carga en Yopal y municipios cercanos de Casanare

## Base de datos y autenticación

La aplicación usa Supabase como base para PostgreSQL, autenticación, almacenamiento de imágenes y Row Level Security.

La migración inicial se encuentra en [`supabase/migrations/20261030000000_initial_schema.sql`](./supabase/migrations/20261030000000_initial_schema.sql). Puede ejecutarse desde el SQL Editor de Supabase o con la CLI:

```bash
npx supabase db push
```

La migración crea:

- perfiles y roles `cliente`, `arrendador` y `admin`;
- publicaciones, imágenes y estados de moderación;
- favoritos, valoraciones, reportes y autorizaciones de contacto;
- políticas RLS para separar permisos por rol.

El trigger de registro crea automáticamente un perfil para cada usuario nuevo de Supabase Auth. El rol inicial solo puede ser `cliente` o `arrendador`; la promoción a `admin` debe hacerse de forma controlada desde el panel de Supabase.