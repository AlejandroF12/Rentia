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
      { texto: 'Valoraciones', href: '/perfil-publico' },
      { texto: 'Mi perfil', href: '/perfil-publico' },
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
  admin: {
    usuario: { nombre: getUser('admin').name, sinAvatar: true },
    rol: 'Administración',
    items: [
      { texto: 'Usuarios', activo: true, href: '/menu-administracion' },
      { texto: 'Publicaciones', href: '/menu-administracion' },
      { texto: 'Reportes', href: '/menu-administracion' },
      { texto: 'Ver sitio público', externo: true, href: '/' },
      { texto: 'Cerrar sesión', salida: true, href: '/' },
    ],
  },
};
