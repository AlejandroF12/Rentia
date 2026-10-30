import { Link } from 'react-router-dom';
import { ChevronDown, LoaderCircle, RefreshCw, Search, WifiOff } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Field from '../components/Field';
import InfoBox from '../components/InfoBox';
import { tiposEquipo } from '../data/muestra';

function FiltrosCatalogo() {
  return (
    <aside aria-labelledby="filtros-titulo" className="hidden h-fit rounded-2xl border border-border bg-surface p-5 lg:block">
      <h2 id="filtros-titulo" className="text-heading-sm font-semibold text-text">Filtros</h2>

      <fieldset className="mt-5">
        <legend className="mb-3 text-label font-semibold text-text">Tipo de equipo</legend>
        <div className="space-y-4">
          {tiposEquipo.map((tipo, i) => (
            <Checkbox key={tipo} id={`error-tipo-${i}`} defaultChecked={i === 0}>{tipo}</Checkbox>
          ))}
        </div>
      </fieldset>

      <hr className="my-6 border-border" />

      <div>
        <label htmlFor="error-cerca-de" className="mb-3 block text-label font-semibold text-text">Cerca de</label>
        <div className="relative">
          <select
            id="error-cerca-de"
            defaultValue="Yopal, Casanare"
            className="h-11 w-full appearance-none rounded-lg border border-border bg-surface pl-3 pr-10 text-body text-text"
          >
            <option>Yopal, Casanare</option>
            <option>Aguazul, Casanare</option>
            <option>Tauramena, Casanare</option>
          </select>
          <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text" />
        </div>
        <div className="mt-5 flex items-center justify-between text-small">
          <label htmlFor="error-radio" className="text-text-muted">Radio de búsqueda</label>
          <span className="font-semibold text-text">150 km</span>
        </div>
        <input id="error-radio" type="range" min="10" max="300" defaultValue="150" className="mt-2 w-full accent-primary" />
        <p className="mt-3 text-caption text-text-muted">Usamos ubicaciones aproximadas para mostrar equipos cercanos.</p>
      </div>

      <hr className="my-6 border-border" />

      <fieldset>
        <legend className="mb-3 text-label font-semibold text-text">Disponibilidad</legend>
        <Checkbox id="error-solo-disponibles" defaultChecked>Solo disponibles</Checkbox>
        <p className="mt-3 text-caption text-text-muted">Estado indicado por el propietario.</p>
      </fieldset>

      <Button type="submit" size="lg" fullWidth className="mt-5">Aplicar filtros</Button>
    </aside>
  );
}

export default function CatalogoErrorPage() {
  return (
    <PaginaCuenta rol={null} fondo="surface">
      <PageHeader
        breadcrumb="Inicio / Explorar equipos"
        eyebrow="Explorar equipos"
        titulo="Tu próximo aliado."
        subtitulo="Maquinaria y vehículos de propietarios de Casanare."
      />

      {/* Buscador: barra en escritorio, campo con etiqueta en móvil */}
      <form role="search" className="mt-8">
        <div className="lg:hidden">
          <Field id="error-buscar-movil" label="Buscar maquinaria o vehículo" defaultValue="Retroexcavadora" trailingIcon={Search} />
        </div>
        <div className="hidden items-center gap-4 rounded-2xl bg-surface-muted p-3 pl-5 lg:flex">
          <Search size={16} aria-hidden="true" className="shrink-0 text-text" />
          <div className="min-w-0 flex-1">
            <label htmlFor="error-buscar" className="block text-caption font-semibold text-text">Buscar maquinaria o vehículo</label>
            <input
              id="error-buscar"
              type="search"
              defaultValue="Retroexcavadora"
              className="mt-0.5 w-full bg-transparent text-label text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <span className="text-label text-text">Yopal, Casanare</span>
          <Button type="submit" size="lg">Buscar equipos</Button>
        </div>
      </form>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <FiltrosCatalogo />

        <section aria-labelledby="resultados-busqueda">
          <h2 id="resultados-busqueda" className="text-label text-text-muted md:text-body">Resultados de tu búsqueda</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• Yopal · Hasta 150 km</span>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• Solo disponibles</span>
          </div>

          {/* Estado de error */}
          <div role="alert" className="mt-5 rounded-2xl border border-border bg-surface p-5 md:px-8 md:py-20 lg:text-center">
            <WifiOff size={36} strokeWidth={1.5} aria-hidden="true" className="text-primary lg:mx-auto" />
            <h3 className="mt-6 text-heading-lg font-semibold text-text">No pudimos cargar los equipos.</h3>
            <p className="mt-4 text-body-lg text-text-muted lg:text-body">
              Revisa tu conexión e inténtalo de nuevo. Tu búsqueda y tus filtros se conservan.
            </p>
            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:justify-center">
              <Button type="button" size="lg" icon={RefreshCw}>Reintentar</Button>
              <Button as={Link} to="/" variant="secondary" size="lg">Volver al inicio</Button>
            </div>
          </div>

          <InfoBox title="No es una búsqueda sin resultados" className="mt-5">
            Todavía no pudimos consultar el catálogo. No necesitas volver a escribir tus criterios.
          </InfoBox>

          {/* Estado de carga al reintentar */}
          <div className="mt-5 rounded-2xl bg-surface-muted p-5">
            <p className="text-label font-semibold text-text-muted">Al reintentar · Estado de carga</p>
            <p role="status" className="mt-4 flex items-center gap-3 text-small text-text-muted">
              <LoaderCircle size={16} aria-hidden="true" /> Buscando equipos cerca de Yopal...
            </p>
            <div aria-hidden="true" className="mt-4 h-1 rounded-full bg-primary-alpha-14" />
          </div>
        </section>
      </div>
    </PaginaCuenta>
  );
}
