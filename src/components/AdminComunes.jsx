import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, Search, Shield, Tractor, User } from 'lucide-react';
import PageHeader from './PageHeader';
import Field from './Field';
import Select from './Select';
import Button from './Button';
import Badge from './Badge';

/** Piezas compartidas por las pantallas del Centro de moderación (Usuarios, Publicaciones, Reportes). */

/** Encabezado: "Centro de moderación" (solo móvil) + eyebrow + título + chip del administrador (escritorio). */
export function CabeceraAdmin({ seccion, titulo, subtitulo }) {
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
            <Shield size={16} aria-hidden="true" /> Andrea Pérez
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
];

/** Pestañas de sección con el contador de reportes pendientes. */
export function PestanasAdmin({ activa }) {
  return (
    <nav
      aria-label="Secciones de moderación"
      className="mt-6 flex items-center gap-x-5 text-label md:mt-8 md:border-b md:border-border md:pb-4"
    >
      {SECCIONES.map(({ id, label, to }) => (
        <Link
          key={id}
          to={to}
          aria-current={id === activa ? 'page' : undefined}
          className={id === activa ? 'font-semibold text-text' : 'text-text-muted'}
        >
          {label}
          {id === 'reportes' && (
            <>
              <span className="md:hidden"> (7)</span>
              <sup className="ml-1 hidden text-caption text-accent md:inline">7</sup>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}

/** Búsqueda + estado en móvil (campos con etiqueta, fuera de la tarjeta). */
export function FiltrosMovil({ id, etiqueta, placeholder, estados }) {
  return (
    <div className="mt-6 space-y-5 lg:hidden">
      <Field id={`${id}-movil`} label={etiqueta} placeholder={placeholder} trailingIcon={Search} />
      <Select id={`${id}-estado-movil`} label="Estado" defaultValue="todos">
        <option value="todos">Todos los estados</option>
        {estados.map((estado) => (
          <option key={estado}>{estado}</option>
        ))}
      </Select>
    </div>
  );
}

/** Búsqueda + estado en escritorio (barra dentro de la tarjeta). */
export function FiltrosEscritorio({ id, placeholder, estados }) {
  return (
    <div className="hidden items-center gap-4 p-5 lg:flex">
      <div className="relative flex-1">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          id={`${id}-escritorio`}
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-label text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-alpha-14"
        />
      </div>
      <div className="relative">
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text" />
        <select
          aria-label="Filtrar por estado"
          defaultValue="todos"
          className="h-11 appearance-none rounded-lg border border-border bg-surface pl-11 pr-5 text-label font-semibold text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-alpha-14"
        >
          <option value="todos">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado}>{estado}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** Pie del listado: contador + paginación (escritorio) o "Siguiente página" (móvil). */
export function PieListado({ resumen, paginas }) {
  return (
    <>
      <div className="hidden items-center justify-between border-t border-border px-6 py-5 text-small text-text-muted lg:flex">
        <span>{resumen}</span>
        <span className="inline-flex items-center gap-4 text-text">
          <button type="button" aria-label="Página anterior"><ArrowLeft size={14} aria-hidden="true" /></button>
          <span>1 / {paginas}</span>
          <button type="button" aria-label="Página siguiente"><ArrowRight size={14} aria-hidden="true" /></button>
        </span>
      </div>
      <div className="mt-6 lg:hidden">
        <p className="text-small text-text-muted">
          {resumen} · Página 1 de {paginas}
        </p>
        <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4">
          Siguiente página →
        </Button>
      </div>
    </>
  );
}

/** Miniatura de la fila (escritorio): foto o, sin foto, icono. */
export function MiniaturaFila({ foto = false, usuario = false }) {
  if (foto) {
    return (
      <div
        role="img"
        aria-label="imagen no encontrada"
        className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-muted p-1 text-center text-[8px] leading-tight text-text-muted"
      >
        imagen no encontrada
      </div>
    );
  }
  const Icono = usuario ? User : Tractor;
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center bg-surface-selected text-text ${usuario ? 'rounded-full' : 'rounded-lg'}`}
    >
      <Icono size={18} />
    </span>
  );
}

/** Estado en insignia a partir de un catálogo de estados (data/moderacion.jsx). */
export function EstadoInsignia({ catalogo, estado, className = '' }) {
  const { label, tone } = catalogo[estado];
  return <Badge tone={tone} className={className}>{label}</Badge>;
}
