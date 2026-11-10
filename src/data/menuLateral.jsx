import { LayoutGrid, Truck, Star, User, Heart, Users, Tractor, Flag, Scale } from 'lucide-react';

/** Menú lateral de las áreas privadas (escritorio). `id` se usa para marcar el ítem activo. */
export const menusLaterales = {
  arrendador: {
    titulo: 'Mi negocio',
    items: [
      { id: 'resumen', texto: 'Resumen', icono: LayoutGrid, href: '/arrendador/resumen' },
      { id: 'equipos', texto: 'Mis equipos', icono: Truck, href: '/arrendador/equipos' },
      { id: 'valoraciones', texto: 'Valoraciones', icono: Star, href: '/arrendador/valoraciones' },
      { id: 'perfil', texto: 'Mi perfil', icono: User, href: '/arrendador/perfil' },
    ],
  },
  admin: {
    titulo: 'Administración',
    items: [
      { id: 'resumen', texto: 'Resumen', icono: LayoutGrid, href: '/admin/resumen' },
      { id: 'usuarios', texto: 'Usuarios', icono: Users, href: '/admin/usuarios' },
      { id: 'publicaciones', texto: 'Publicaciones', icono: Tractor, href: '/admin/publicaciones' },
      { id: 'reportes', texto: 'Reportes', icono: Flag, href: '/admin/reportes' },
      { id: 'apelaciones', texto: 'Apelaciones', icono: Scale, href: '/admin/apelaciones' },
    ],
  },
  cliente: {
    titulo: 'Mi cuenta',
    items: [
      { id: 'espacio', texto: 'Mi espacio', icono: LayoutGrid, href: '/cliente' },
      { id: 'favoritos', texto: 'Favoritos', icono: Heart, href: '/cliente/favoritos' },
      { id: 'valoraciones', texto: 'Valoraciones', icono: Star, href: '/cliente/valoraciones' },
      { id: 'perfil', texto: 'Mi perfil', icono: User, href: '/cliente/perfil' },
    ],
  },
};
