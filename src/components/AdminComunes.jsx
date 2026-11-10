import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import PageHeader from './PageHeader';
import { useAuth } from '../context/AuthContext';

/** Piezas compartidas por las pantallas del Centro de moderación (Usuarios, Publicaciones, Reportes). */

/** Encabezado: "Centro de moderación" (solo móvil) + eyebrow + título + chip del administrador (escritorio). */
export function CabeceraAdmin({ seccion, titulo, subtitulo }) {
  const { profile } = useAuth();
  return (
    <>
      <p className="mb-6 text-small text-text-muted md:hidden">Centro de moderación</p>
      <PageHeader
        eyebrow={
          <>
            <span className="md:hidden">Administración / {seccion}</span>
            <span className="hidden md:inline">Administración / Moderación</span>
          </>
        }
        titulo={titulo}
        subtitulo={subtitulo}
        accion={
          <span className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-label text-text md:inline-flex">
            <Shield size={16} aria-hidden="true" /> {profile?.full_name || 'Administrador'}
          </span>
        }
      />
    </>
  );
}

const SECCIONES = [
  { id: 'usuarios', label: 'Usuarios', to: '/admin/usuarios' },
  { id: 'publicaciones', label: 'Publicaciones', to: '/admin/publicaciones' },
  { id: 'reportes', label: 'Reportes', to: '/admin/reportes' },
  { id: 'apelaciones', label: 'Apelaciones', to: '/admin/apelaciones' },
];

/** Pestañas de sección con el contador de reportes pendientes. */
export function PestanasAdmin({ activa, reportCount = 0 }) {
  return (
    <nav
      aria-label="Secciones de moderación"
      className="mt-6 flex max-w-full items-center gap-x-5 overflow-x-auto text-label md:mt-8 md:border-b md:border-border md:pb-4"
    >
      {SECCIONES.map(({ id, label, to }) => (
        <Link
          key={id}
          to={to}
          aria-current={id === activa ? 'page' : undefined}
          className={`shrink-0 whitespace-nowrap ${id === activa ? 'font-semibold text-text' : 'text-text-muted'}`}
        >
          {label}
          {(id === 'reportes' || id === 'apelaciones') && (
            <>
              <span className="md:hidden"> ({reportCount})</span>
              <sup className="ml-1 hidden text-caption text-accent md:inline">{reportCount}</sup>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}
