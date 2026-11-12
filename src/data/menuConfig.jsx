export const menus = {
  public: {
    superior: 'CASANARE, COLOMBIA',
    titulo: 'Hagamos equipo.',
    items: [
      { texto: 'Explorar equipos', activo: true, href: '/catalogo' },
      { texto: 'Ingresar', href: '/ingresar' },
      { texto: 'Publicar equipo', href: '/crear-cuenta' },
    ],
  },
  cliente: {
    usuario: { nombre: 'Tu perfil', detalle: 'Cliente' },
    rol: 'Cliente',
    items: [
      { texto: 'Explorar equipos', href: '/catalogo' },
      { texto: 'Mi espacio', activo: true, href: '/cliente' },
      { texto: 'Favoritos', href: '/cliente/favoritos' },
      { texto: 'Valoraciones', href: '/cliente/valoraciones' },
      { texto: 'Mi perfil', href: '/cliente/perfil' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
  arrendador: {
    usuario: { nombre: 'Tu perfil', detalle: 'Arrendador' },
    rol: 'Arrendador',
    items: [
      { texto: 'Explorar equipos', href: '/catalogo' },
      { texto: 'Mis equipos', activo: true, href: '/arrendador/equipos' },
      { texto: 'Agregar vehículo', href: '/arrendador/equipos/nuevo' },
      { texto: 'Valoraciones', href: '/arrendador/valoraciones' },
      { texto: 'Mi perfil', href: '/arrendador/perfil' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
  suspendido: {
    usuario: { nombre: 'Tu perfil', detalle: 'Cuenta suspendida' },
    rol: 'Suspendido',
    items: [
      { texto: 'Explorar equipos', href: '/catalogo' },
      { texto: 'Estado de cuenta', activo: true, href: '/cuenta-suspendida' },
      { texto: 'Normas de publicación', href: '/normas' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
  admin: {
    usuario: { nombre: 'Administración', sinAvatar: true },
    rol: 'Administración',
    items: [
      { texto: 'Resumen', activo: true, href: '/admin/resumen' },
      { texto: 'Usuarios', href: '/admin/usuarios' },
      { texto: 'Publicaciones', href: '/admin/publicaciones' },
      { texto: 'Reportes', href: '/admin/reportes' },
      { texto: 'Apelaciones', href: '/admin/apelaciones' },
      { texto: 'Ver sitio público', externo: true, href: '/' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
};
