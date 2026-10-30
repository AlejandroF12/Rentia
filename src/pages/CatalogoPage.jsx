import { Search, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Pagination from '../components/Pagination';
import EquipoCard from '../components/EquipoCard';
import { equipos, tiposEquipo } from '../data/muestra';

function Filtros() {
  return (
    <aside className="hidden h-fit rounded-2xl border border-border bg-surface p-5 lg:block">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-text">Filtros</h2>
        <button type="reset" className="text-small text-accent">Limpiar</button>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-3 text-label font-semibold text-text">Tipo de equipo</legend>
        <div className="space-y-3">
          {tiposEquipo.map((tipo, i) => (
            <Checkbox key={tipo} id={`tipo-${i}`} defaultChecked={i === 0}>{tipo}</Checkbox>
          ))}
        </div>
      </fieldset>

      <hr className="my-5 border-border" />

      <div>
        <label htmlFor="cerca-de" className="mb-3 block text-label font-semibold text-text">Cerca de</label>
        <div className="relative">
          <input
            id="cerca-de"
            defaultValue="Yopal, Casanare"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-body text-text"
          />
          <MapPin size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
        </div>
        <div className="mt-4 flex items-center justify-between text-small">
          <label htmlFor="radio" className="text-text-muted">Radio de búsqueda</label>
          <span className="font-semibold text-text">150 km</span>
        </div>
        <input id="radio" type="range" min="10" max="300" defaultValue="150" className="mt-2 w-full accent-primary" />
        <p className="mt-3 text-caption text-text-muted">Usamos ubicaciones aproximadas para mostrar equipos cercanos.</p>
      </div>

      <hr className="my-5 border-border" />

      <fieldset>
        <legend className="mb-3 text-label font-semibold text-text">Disponibilidad</legend>
        <Checkbox id="solo-disponibles">Solo disponibles</Checkbox>
        <p className="mt-2 text-caption text-text-muted">Estado indicado por el propietario.</p>
      </fieldset>

      <Button size="lg" fullWidth className="mt-5">Aplicar filtros</Button>
    </aside>
  );
}

function ChipSelect({ children }) {
  return (
    <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small text-text">
      {children}
      <ChevronDown size={14} aria-hidden="true" />
    </button>
  );
}

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16 lg:pt-8">
        <Breadcrumb>Inicio / Explorar equipos</Breadcrumb>

        <h1 className="mt-6 text-title-mobile font-semibold text-text md:text-title-desktop">
          <span className="lg:hidden">Tu próximo aliado.</span>
          <span className="hidden lg:inline">El equipo que necesitas, cerca.</span>
        </h1>
        <p className="mt-2 text-body-lg text-text-muted">Maquinaria y vehículos de propietarios de Casanare.</p>

        {/* Buscador */}
        <form role="search" className="mt-8 flex items-center gap-3 rounded-2xl bg-surface-muted p-3 md:pl-5">
          <Search size={18} aria-hidden="true" className="hidden shrink-0 text-text-muted sm:block" />
          <input
            type="search"
            aria-label="Buscar maquinaria o vehículo"
            placeholder="Buscar maquinaria o vehículo"
            className="h-10 min-w-0 flex-1 bg-transparent px-2 text-body text-text placeholder:text-text-muted focus:outline-none"
          />
          <span className="hidden text-label text-text lg:block">Yopal, Casanare</span>
          <Button type="submit" size="lg">
            <span className="lg:hidden">Buscar</span>
            <span className="hidden lg:inline">Buscar equipos</span>
          </Button>
        </form>

        {/* Filtros en móvil */}
        <div className="mt-6 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-label font-semibold text-text">Afinar búsqueda</h2>
            <SlidersHorizontal size={18} aria-hidden="true" className="text-text-muted" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <ChipSelect>Todos los tipos</ChipSelect>
            <ChipSelect>Hasta 150 km</ChipSelect>
            <ChipSelect>Todos los estados</ChipSelect>
          </div>
          <p className="mt-3 text-small text-text-muted">Cerca de Yopal · Distancia aproximada</p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <Filtros />

          <section aria-labelledby="resultados">
            <div className="flex items-center justify-between">
              <h2 id="resultados" className="text-label text-text md:text-body">18 equipos cerca de Yopal</h2>
              <button type="button" className="inline-flex items-center gap-2 text-small text-text-muted">
                Más cercanos <ChevronDown size={14} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 hidden gap-2 lg:flex">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• Hasta 150 km</span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• Todos los estados</span>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {equipos.map((equipo) => (
                <EquipoCard key={equipo.id} equipo={equipo} />
              ))}
            </div>

            <div className="mt-10">
              <Pagination />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
