import { LayoutGrid, Truck, Star, User, Heart, Users, Tractor, Flag } from 'lucide-react';

/** Menú lateral de las áreas privadas (escritorio). `id` se usa para marcar el ítem activo. */
export const menusLaterales = {
  arrendador: {
    titulo: 'Mi negocio',
    items: [
      { id: 'resumen', texto: 'Resumen', icono: LayoutGrid, href: '#' },
      { id: 'equipos', texto: 'Mis equipos', icono: Truck, href: '/arrendador/equipos' },
      { id: 'valoraciones', texto: 'Valoraciones', icono: Star, href: '/perfil-publico' },
      { id: 'perfil', texto: 'Mi perfil', icono: User, href: '/perfil-publico' },
    ],
  },
  admin: {
    titulo: 'Administración',
    items: [
      { id: 'resumen', texto: 'Resumen', icono: LayoutGrid, href: '#' },
      { id: 'usuarios', texto: 'Usuarios', icono: Users, href: '/admin/usuarios' },
      { id: 'publicaciones', texto: 'Publicaciones', icono: Tractor, href: '/admin/publicaciones' },
      { id: 'reportes', texto: 'Reportes', icono: Flag, href: '/admin/reportes' },
    ],
  },
  cliente: {
    titulo: 'Mi cuenta',
    items: [
      { id: 'espacio', texto: 'Mi espacio', icono: LayoutGrid, href: '/cliente' },
      { id: 'favoritos', texto: 'Favoritos', icono: Heart, href: '/cliente/favoritos' },
      { id: 'valoraciones', texto: 'Valoraciones', icono: Star, href: '/perfil-publico' },
      { id: 'perfil', texto: 'Mi perfil', icono: User, href: '/perfil-publico' },
    ],
  },
};
