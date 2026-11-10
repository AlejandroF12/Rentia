# Rentia

Rentia es una plataforma web para conectar a personas que necesitan alquilar maquinaria, equipos industriales o vehículos de carga con arrendadores de Casanare. Permite explorar publicaciones, conocer sus detalles y contactar directamente con el propietario para acordar el alquiler.

> Rentia facilita el descubrimiento y el contacto. El precio, la disponibilidad final, la entrega y las demás condiciones se acuerdan directamente entre cliente y arrendador.

## Qué puedes hacer

### Como cliente

- Explorar equipos publicados y filtrar por categoría, municipio y disponibilidad.
- Consultar fotos, descripción, ubicación aproximada y valoraciones.
- Guardar publicaciones como favoritas.
- Contactar al arrendador cuando haya iniciado sesión y este haya autorizado compartir sus datos de contacto.
- Enviar valoraciones después de una experiencia y reportar publicaciones o valoraciones.

### Como arrendador

- Crear un perfil y administrar los datos de su cuenta.
- Decidir si autoriza que usuarios con sesión vean su teléfono.
- Publicar equipos con fotos, descripción y ubicación; editar, gestionar su disponibilidad o retirar publicaciones.
- Consultar las valoraciones recibidas y valorar a clientes cuando corresponda.

### Como administrador

- Consultar resúmenes y gestionar usuarios y publicaciones.
- Revisar reportes de contenido y solicitudes de apelación.
- Moderar publicaciones y valoraciones según los permisos definidos en Supabase.

Los roles disponibles son `cliente`, `arrendador` y `admin`. El registro público está pensado para clientes y arrendadores; la creación o promoción de administradores debe hacerse de forma controlada desde Supabase.

## Tecnologías

- React 19 y React Router para la interfaz y navegación.
- Vite para desarrollo y compilación.
- Tailwind CSS para estilos.
- Supabase para PostgreSQL, autenticación, almacenamiento de imágenes y Row Level Security (RLS).
- React Leaflet y Leaflet para mapas.

## Requisitos

- Node.js y npm.
- Un proyecto Supabase configurado para Rentia.

## Ejecutar en local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea `.env.local` en la raíz y configura las variables requeridas:

   ```dotenv
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
   ```

   El frontend necesita la URL raíz del proyecto Supabase y su clave pública `anon`/publishable. No añadas `service_role`, contraseñas de base de datos ni otros secretos a variables `VITE_*`: Vite las incorpora al código accesible desde el navegador. `.env.local` está excluido de Git.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección que indique Vite (normalmente `http://localhost:5173`).

## Supabase

Las migraciones versionadas están en [`supabase/migrations`](./supabase/migrations). Se deben aplicar **en orden cronológico por el prefijo del nombre**, una sola vez en el proyecto Supabase que utiliza la aplicación. En este repositorio no hay configuración de Supabase CLI; puedes revisar y ejecutar los archivos pendientes desde el SQL Editor de Supabase. Si prefieres usar la CLI, primero configura el proyecto local y enlázalo al proyecto remoto siguiendo la documentación de Supabase.

Antes de ejecutar una migración en producción:

1. Confirma cuál es la última migración aplicada en ese proyecto.
2. Revisa y ejecuta únicamente las posteriores, en orden.
3. Comprueba las políticas RLS, funciones y permisos con las herramientas de Supabase después de aplicarlas.

Las migraciones abarcan perfiles y roles, publicaciones e imágenes, favoritos, valoraciones, reportes, moderación, apelaciones, autorización de contacto y políticas de acceso. La base de datos debe aplicar RLS correctamente: la clave pública del cliente no sustituye los permisos ni debe tratarse como secreto.

Las redirecciones de confirmación de cuenta y recuperación de contraseña están configuradas en [`src/services/authService.js`](./src/services/authService.js). Al usar otro dominio, actualiza allí la URL de la aplicación y añade los dominios correspondientes a las URL permitidas de Supabase Auth.

## Aplicación Android de prueba

La app Android reutiliza la interfaz React compilada y se conecta al mismo proyecto de Supabase. Esta configuración permite instalar una versión privada para pruebas; no publica la app en Google Play.

Requisitos:

- Node.js y dependencias del proyecto instaladas.
- Android Studio con Android SDK y las herramientas de compilación instaladas.
- Un teléfono Android con depuración USB activada, o un emulador.
- `.env.local` configurado con las variables de Supabase antes de compilar.

Flujo de trabajo:

1. Ejecuta `npm install`.
2. Ejecuta `npm run android:sync` para compilar la web y copiarla al proyecto nativo.
3. Ejecuta `npm run android:open` para abrir el proyecto en Android Studio.
4. Espera la sincronización de Gradle, conecta el teléfono con depuración USB autorizada y pulsa **Run** en Android Studio.

Cada cambio de interfaz requiere volver a ejecutar `npm run android:sync` y ejecutar/instalar de nuevo la app. Los cambios de datos en Supabase se comparten con la web sin recompilar. Los enlaces de confirmación de cuenta y recuperación todavía abren el sitio web; el retorno directo desde esos enlaces a la app requiere configurar Android App Links más adelante.

## Compilar y comprobar

```bash
npm run lint
npm run build
npm run preview
```

La compilación de producción se genera en `dist/`. Vite puede mostrar una advertencia si un chunk de JavaScript supera el umbral configurado; no implica por sí sola que la compilación haya fallado.

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Configura las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en los entornos que vayas a desplegar.
3. Usa el comando de compilación `npm run build` y el directorio de salida `dist`.
4. Despliega y prueba las rutas principales, la autenticación y las acciones de cada rol.
5. Si conectas un dominio personalizado, actualiza las URL de redirección de [`authService.js`](./src/services/authService.js) y la lista de URLs permitidas en Supabase Auth.

[`vercel.json`](./vercel.json) reescribe las rutas de la aplicación hacia `index.html`, para que las rutas internas de React Router también funcionen al abrirlas directamente.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación generada. |
