/** Datos de ejemplo del Centro de moderación (reemplazar por datos reales cuando haya backend). */

export const estadosPublicacion = {
  visible: { label: 'Visible', tone: 'success' },
  revision: { label: 'En revisión', tone: 'warning' },
  suspendida: { label: 'Suspendida', tone: 'danger' },
  eliminada: { label: 'Eliminada', tone: 'neutral' },
};

export const estadosUsuario = {
  activo: { label: 'Activo', tone: 'success' },
  suspendido: { label: 'Suspendido', tone: 'danger' },
  eliminado: { label: 'Eliminado', tone: 'neutral' },
};

export const estadosReporte = {
  pendiente: { label: 'Pendiente', tone: 'warning' },
  revision: { label: 'En revisión', tone: 'warning' },
  resuelto: { label: 'Resuelto', tone: 'success' },
  recibido: { label: 'Recibido', tone: 'success' },
};

export const resumenPublicaciones = { visibles: '62', revision: '4', suspendidas: '3' };
export const resumenUsuarios = { activos: '248', suspendidos: '6', eliminados: '3' };
export const resumenReportes = { pendientes: '07', revision: '03', resueltos: '28' };

export const publicaciones = [
  { id: 1, nombre: 'Retroexcavadora CAT 420F', detalle: 'Carlos Rojas · Yopal', categoria: 'Movimiento de tierra', actualizacion: '18 oct. 2026', estado: 'visible', foto: true, accion: 'Ver publicación', to: '/detalle-equipo' },
  { id: 2, nombre: 'Volqueta doble troque', detalle: 'Carlos Rojas · Tauramena', categoria: 'Transporte de carga', actualizacion: '16 oct. 2026', estado: 'visible', foto: true, accion: 'Ver publicación', to: '/detalle-equipo' },
  { id: 3, nombre: 'Cargador frontal', detalle: 'Pablo Ortega · Aguazul', categoria: 'Movimiento de tierra', actualizacion: '17 oct. 2026', estado: 'revision', destacada: true, accion: 'Moderar', to: '/admin/reportes' },
  { id: 4, nombre: 'Retroexcavadora sin datos', detalle: 'Luis Méndez · Tauramena', categoria: 'Movimiento de tierra', actualizacion: '15 oct. 2026', estado: 'suspendida', accion: 'Revisar caso', to: '/admin/reportes' },
  { id: 5, nombre: 'Volqueta duplicada', detalle: 'Publicación retirada', categoria: 'Transporte de carga', actualizacion: '14 oct. 2026', estado: 'eliminada', accion: 'Ver registro', to: '#' },
];

export const usuarios = [
  { id: 1, nombre: 'Carlos Rojas', detalle: 'carlos.rojas@correo.com', rol: 'Arrendador', municipio: 'Yopal', estado: 'activo', accion: 'Ver usuario', to: '/perfil-publico' },
  { id: 2, nombre: 'María López', detalle: 'maria.lopez@correo.com', rol: 'Cliente', municipio: 'Yopal', estado: 'activo', accion: 'Ver usuario', to: '/perfil-publico' },
  { id: 3, nombre: 'Luis Méndez', detalle: 'luis.mendez@correo.com', rol: 'Arrendador', municipio: 'Tauramena', estado: 'suspendido', accion: 'Revisar caso', to: '/admin/reportes' },
  { id: 4, nombre: 'Pablo Ortega', detalle: 'pablo.ortega@correo.com', rol: 'Arrendador', municipio: 'Aguazul', estado: 'activo', destacada: true, accion: 'Ver usuario', to: '/perfil-publico' },
  { id: 5, nombre: 'Ana Torres', detalle: 'Cuenta retirada por moderación', rol: 'Cliente', municipio: 'Villanueva', estado: 'eliminado', accion: 'Ver registro', to: '#' },
];

/** El Figma muestra fechas distintas en web y móvil para los mismos reportes; se respetan ambas. */
export const reportes = [
  { id: 'REP-108', fechaWeb: 'Hoy, 09:40', fechaMovil: '18 oct. 2026', titulo: 'Fotografías ajenas', equipo: 'Cargador frontal', municipio: 'Aguazul', estado: 'revision', seleccionado: true },
  { id: 'REP-109', fechaWeb: '16 oct. 2026', fechaMovil: '18 oct. 2026', titulo: 'Información incompleta', equipo: 'Tractor agrícola', municipio: 'Villanueva', estado: 'pendiente' },
  { id: 'REP-106', fechaWeb: '16 oct. 2026', fechaMovil: '18 oct. 2026', titulo: 'Información engañosa', equipo: 'Retroexcavadora', municipio: 'Tauramena', estado: 'resuelto', nota: 'Usuario y publicación suspendidos' },
  { id: 'REP-103', fechaWeb: '16 oct. 2026', fechaMovil: '18 oct. 2026', titulo: 'Publicación duplicada', equipo: 'Volqueta', municipio: 'Yopal', estado: 'resuelto', nota: 'Publicación eliminada' },
];

/** Columnas de las tablas del panel (escritorio): contenido · columna · fecha/municipio · estado · acción. */
export const COLUMNAS_TABLA = 'lg:grid-cols-[minmax(0,1fr)_150px_104px_112px_128px]';
