# Rentia

Rentia es un proyecto académico que desarrolla un prototipo web y móvil para explorar publicaciones de maquinaria, equipos y vehículos de carga en Casanare. Permite probar flujos de cliente, arrendador y administrador, incluyendo publicación de equipos, favoritos, valoraciones y moderación.

Esta versión es una demostración, no un servicio comercial listo para producción. Usa datos de prueba y no ingreses contraseñas reutilizadas, información financiera ni otros datos sensibles. Rentia no gestiona reservas ni contratos de alquiler y no procesa pagos reales.

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

Los roles disponibles son `cliente`, `arrendador` y `admin`. El registro público está habilitado para clientes y arrendadores. No existe autorregistro de administradores; esas cuentas se deben gestionar de forma controlada.

## Pantallas principales

| Ruta | Uso |
| --- | --- |
| `/` | Inicio y explicación del prototipo. |
| `/catalogo` | Explorar equipos, buscar, filtrar por categoría, municipio, disponibilidad y distancia con GPS. |
| `/detalle-equipo` | Consultar una publicación, fotos y datos del arrendador disponibles para la sesión. |
| `/crear-cuenta` y `/ingresar` | Crear cuenta de cliente o arrendador e iniciar sesión. |
| `/cliente` | Espacio del cliente, favoritos y valoraciones. |
| `/arrendador/equipos` | Gestionar publicaciones del arrendador. |
| `/admin/resumen` | Inicio del área de administración. |
| `/admin/usuarios`, `/admin/publicaciones`, `/admin/reportes`, `/admin/apelaciones` | Moderación y gestión de casos. |
| `/terminos`, `/privacidad`, `/normas` | Información del proyecto y reglas de uso. |

## Tecnologías

- React 19 y React Router para la interfaz y navegación.
- Vite para desarrollo y compilación.
- Tailwind CSS para estilos.
- Supabase para PostgreSQL, autenticación, almacenamiento de imágenes y Row Level Security (RLS).
- React Leaflet y Leaflet para mapas.
- Capacitor para empaquetar el mismo frontend como aplicación Android de prueba.

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
   # Opcional: origen de los enlaces de confirmación y recuperación en la web local
   VITE_APP_URL=http://localhost:5173
   ```

   El frontend necesita la URL raíz del proyecto Supabase y su clave pública `anon`/publishable. En web, si `VITE_APP_URL` no está definida, los enlaces de autenticación usan el origen actual; Android usa el sitio configurado por defecto. Añade el origen elegido y la URL completa de recuperación (`<origen>/nueva-contrasena`) a las URL permitidas de Supabase Auth. No añadas `service_role`, contraseñas de base de datos ni otros secretos a variables `VITE_*`: Vite las incorpora al código accesible desde el navegador. `.env.local` está excluido de Git.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre en el navegador la dirección que indique Vite (normalmente `http://localhost:5173`).

## Supabase

Las migraciones versionadas están en [`supabase/migrations`](./supabase/migrations). Se deben aplicar **en orden cronológico por el prefijo del nombre**, una sola vez en el proyecto Supabase que utiliza la aplicación. El archivo [`supabase/config.toml`](./supabase/config.toml) define la verificación JWT de las Edge Functions; el proyecto aún debe enlazarse a Supabase CLI antes de desplegarlas. Puedes revisar y ejecutar migraciones desde el SQL Editor o usar la CLI tras enlazar el proyecto.

Antes de ejecutar una migración en producción:

1. Confirma cuál es la última migración aplicada en ese proyecto.
2. Revisa y ejecuta únicamente las posteriores, en orden.
3. Comprueba las políticas RLS, funciones y permisos con las herramientas de Supabase después de aplicarlas.

Las migraciones abarcan perfiles y roles, publicaciones e imágenes, favoritos, valoraciones, reportes, moderación, apelaciones, autorización de contacto y políticas de acceso. La base de datos debe aplicar RLS correctamente: la clave pública del cliente no sustituye los permisos ni debe tratarse como secreto.

### Suscripciones y pagos Wompi

La interfaz y los permisos incluyen estados de prueba de suscripción. El plan de referencia es **$125.000 COP por mes calendario**, con renovación manual. La migración `20261112200000_wompi_subscription_payments.sql` crea el historial de pagos y mantiene `checkout_enabled = false`; el checkout está desactivado y no se procesa ningún cobro.

La integración usa el Web Checkout de Wompi. El backend de Supabase Edge Functions genera la referencia y firma de integridad; el webhook valida la firma del evento y actualiza el periodo de acceso de forma idempotente. El navegador nunca recibe secretos de Wompi ni puede marcar un pago como aprobado. Las llaves y secretos no se deben guardar en `VITE_*` ni en Git.

Para preparar la integración, enlaza el proyecto con Supabase CLI y despliega las migraciones y funciones:

```bash
supabase link --project-ref <project-ref>
supabase db push
supabase functions deploy create-wompi-subscription-checkout
supabase functions deploy wompi-subscription-webhook
```

No configures llaves de Wompi ni despliegues el proveedor para la demostración: `checkout_enabled` y `WOMPI_PAYMENTS_ENABLED` permanecen en `false`. Las instrucciones y variables de sandbox de la integración son preparatorias; no las habilites para producción sin una revisión del proyecto, proveedor y condiciones aplicables. Wompi determina el destino desde la configuración de su cuenta de comercio, no desde Rentia.

Las redirecciones de confirmación de cuenta y recuperación de contraseña usan `VITE_APP_URL` cuando se configura; consulta [`src/services/authService.js`](./src/services/authService.js). En Supabase Auth, permite el origen de desarrollo o despliegue y la URL completa `<origen>/nueva-contrasena`; de lo contrario, Supabase puede volver a la URL del sitio y la aplicación redirigirá al formulario cuando detecte el evento de recuperación.

## Documentos legales y registro

Las páginas de [términos](./src/data/legales.jsx), [privacidad](./src/data/legales.jsx) y normas identifican a Rentia como nombre del proyecto académico y explican los límites de esta demostración. No son asesoría ni una validación jurídica para operar un servicio comercial; el Centro de ayuda no es un canal formal de reclamos. El registro está habilitado solo para perfiles de cliente y arrendador, y el formulario solicita declarar mayoría de edad y aceptar los textos del proyecto. La autorización para mostrar el teléfono del arrendador es opcional y separada.

El interruptor visual de disponibilidad del registro está en [`src/pages/CrearCuentaPage.jsx`](./src/pages/CrearCuentaPage.jsx), en `PUBLIC_REGISTRATION_ENABLED`. Déjalo en `true` para mostrar el formulario o cámbialo a `false` para volver a mostrar la pantalla de registro pausado. Ese interruptor controla la interfaz; si se necesita bloquear altas de forma efectiva, también hay que deshabilitar el registro en la configuración de Supabase Auth. El formulario no guarda una versión verificable de la aceptación de términos, por lo que esa capacidad se debe añadir antes de cualquier uso comercial.

Para desarrollo académico, usa cuentas y publicaciones de prueba. El prototipo almacena perfiles, fotos, publicaciones, favoritos, valoraciones y reportes en Supabase; borrar una publicación o cerrar sesión no implica que todos los datos relacionados o copias de respaldo se eliminen inmediatamente.

## Aplicación Android de prueba

La app Android reutiliza la interfaz React compilada y se conecta al mismo proyecto de Supabase. Mantener una sola interfaz responsive para web y móvil evita duplicar flujos; los ajustes visuales específicos de móvil se incorporan donde las pruebas del dispositivo los justifiquen. Esta configuración permite instalar una versión privada para pruebas; no publica la app en Google Play.

Requisitos:

- Node.js y dependencias del proyecto instaladas.
- Android Studio con Android SDK y las herramientas de compilación instaladas.
- Un teléfono Android con depuración USB activada, o un emulador.
- `.env.local` configurado con las variables de Supabase antes de compilar.

Flujo de trabajo:

1. Ejecuta `npm install`.
2. Ejecuta `npm run android:sync` para compilar la web y copiarla al proyecto nativo.
3. Ejecuta `npm run android:open` para abrir el proyecto en Android Studio.
4. Espera la sincronización de Gradle. Para instalar por USB, conecta el teléfono con depuración autorizada y pulsa **Run** en Android Studio; también puedes generar un APK desde Android Studio y transferirlo al teléfono.

### Distribuir una versión Android firmada

El enlace **App Android** del sitio descarga directamente el asset `Rentia.apk` del release más reciente de GitHub. Cada release público debe incluir el APK con ese nombre.

La firma de producción debe conservarse entre versiones: si se pierde o se reemplaza la clave, quienes instalaron una versión anterior no podrán actualizarla directamente. Crea una copia de seguridad segura de la clave y nunca la subas a Git ni la compartas en el sitio.

1. En PowerShell, crea un directorio privado y genera una clave de carga. `keytool` solicitará las contraseñas y los datos del certificado; no los compartas en el chat:

   ```powershell
   New-Item -ItemType Directory -Force "$env:USERPROFILE\.rentia"
   keytool -genkeypair -v -keystore "$env:USERPROFILE\.rentia\rentia-upload.jks" -keyalg RSA -keysize 2048 -validity 10000 -alias rentia-upload
   ```

2. Crea `%USERPROFILE%\.rentia\rentia-signing.properties` en tu equipo (fuera del repositorio) con estos valores. Sustituye la ruta y las contraseñas por las que configuraste localmente:

   ```properties
   storeFile=C:/Users/<tu_usuario>/.rentia/rentia-upload.jks
   storePassword=<contraseña_del_keystore>
   keyAlias=rentia-upload
   keyPassword=<contraseña_de_la_clave>
   ```

3. Sincroniza y genera el APK firmado:

   ```powershell
   npm run android:sync
   .\android\gradlew.bat -p .\android assembleRelease
   ```

   El archivo resultante estará en `android/app/build/outputs/apk/release/app-release.apk`. Antes de una versión posterior, incrementa `versionCode` y actualiza `versionName` en `android/app/build.gradle`.

4. En GitHub, crea un release y sube el APK con el nombre `Rentia.apk`. El botón del sitio descarga directamente el APK del release más reciente. Para instalarlo, Android puede pedir permiso para instalar aplicaciones desde esa fuente.

El logo web y los recursos de marca se derivan de `assets/rentia-logo-original.svg`. El icono y la pantalla de inicio se generan desde `assets/` con `npx @capacitor/assets generate --assetPath assets --android --iconBackgroundColor '#ffffff' --splashBackgroundColor '#ffffff'`. El icono usa el isotipo de Rentia y el splash presenta el logo centrado sobre fondo blanco, también en Android 12 y posteriores. La app maneja el botón Atrás de Android y solicita permiso nativo de ubicación al usar una función GPS. En pantallas móviles hay una barra inferior de Explorar, Menú y Perfil, además de acceso directo a Configuración; escritorio conserva su navegación superior. Cada cambio de interfaz o código requiere ejecutar `npm run android:sync` y volver a compilar/instalar. Los cambios de datos en Supabase se comparten con la web sin recompilar. Los enlaces de confirmación de cuenta y recuperación abren el sitio configurado; el retorno directo desde esos enlaces a la app requiere configurar Android App Links más adelante.

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
