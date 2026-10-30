import { getUser } from './users';

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
    usuario: { nombre: getUser('cliente').name, detalle: getUser('cliente').detail },
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
    usuario: { nombre: getUser('arrendador').name, detalle: getUser('arrendador').detail },
    rol: 'Arrendador',
    items: [
      { texto: 'Explorar equipos', href: '/catalogo' },
      { texto: 'Mis equipos', activo: true, href: '/arrendador/equipos' },
      { texto: 'Agregar vehículo', href: '/arrendador/equipos/nuevo' },
      { texto: 'Valoraciones', href: '/perfil-publico' },
      { texto: 'Mi perfil', href: '/perfil-publico' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
  suspendido: {
    usuario: { nombre: getUser('suspendido').name, detalle: getUser('suspendido').detail },
    rol: 'Suspendido',
    items: [
      { texto: 'Explorar equipos', href: '/catalogo' },
      { texto: 'Estado de cuenta', activo: true, href: '/cuenta-suspendida' },
      { texto: 'Normas de publicación', href: '/normas' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
  admin: {
    usuario: { nombre: getUser('admin').name, sinAvatar: true },
    rol: 'Administración',
    items: [
      { texto: 'Usuarios', activo: true, href: '/admin/usuarios' },
      { texto: 'Publicaciones', href: '/admin/publicaciones' },
      { texto: 'Reportes', href: '/admin/reportes' },
      { texto: 'Ver sitio público', externo: true, href: '/' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
};
