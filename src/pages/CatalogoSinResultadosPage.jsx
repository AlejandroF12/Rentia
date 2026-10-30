import { Link } from 'react-router-dom';
import { ArrowDown, MapPin, Search, SearchX } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Field from '../components/Field';
import Select from '../components/Select';
import OpcionSeleccionable from '../components/OpcionSeleccionable';
import { tiposEquipo } from '../data/muestra';

export default function CatalogoSinResultadosPage() {
  return (
    <PaginaCuenta rol={null} ancho="estrecho" fondo="surface">
      <PageHeader
        breadcrumb="Inicio / Explorar equipos"
        eyebrow="Explorar equipos"
        titulo={
          <>
            <span className="lg:hidden">Tu próximo aliado.</span>
            <span className="hidden lg:inline">El equipo que necesitas, cerca.</span>
          </>
        }
        subtitulo="Maquinaria y vehículos de propietarios de Casanare."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-10">
        {/* Búsqueda */}
        <form role="search" className="lg:col-start-1">
          <Field id="buscar-equipo" label="Buscar maquinaria o vehículo" defaultValue="Grúa telescópica" trailingIcon={Search} />
          <Button type="submit" size="lg" fullWidth className="mt-5">Buscar equipos</Button>
        </form>

        {/* Afinar búsqueda */}
        <aside aria-labelledby="afinar" className="h-fit rounded-2xl border border-border bg-surface p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:p-6">
          <h2 id="afinar" className="text-heading-md font-semibold text-text">Afinar búsqueda</h2>
          <form className="mt-5 space-y-5">
            <Select id="tipo-equipo" label="Tipo de equipo" defaultValue="Elevación y apoyo">
              {tiposEquipo.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </Select>
            <Field id="cerca-de" label="Cerca de" defaultValue="Yopal, Casanare" trailingIcon={MapPin} />
            <Select id="radio" label="Radio aproximado" defaultValue="Hasta 5 km">
              <option>Hasta 5 km</option>
              <option>Hasta 25 km</option>
              <option>Hasta 50 km</option>
              <option>Hasta 150 km</option>
            </Select>
            <div>
              <OpcionSeleccionable type="checkbox" id="solo-disponibles" defaultChecked titulo="Solo disponibles" className="items-center" />
              <p className="mt-3 text-small text-text-muted">Estado indicado por el propietario. Distancia aproximada, sin seguimiento GPS.</p>
            </div>
            <div className="space-y-3">
              <Button type="submit" size="lg" fullWidth>Aplicar filtros</Button>
              <Button type="reset" variant="secondary" size="lg" fullWidth>Limpiar filtros</Button>
            </div>
          </form>
        </aside>

        {/* Resultados */}
        <section aria-labelledby="resultados" className="lg:col-start-1">
          <div className="flex items-center justify-between">
            <h2 id="resultados" className="text-label text-text md:text-body">0 equipos encontrados</h2>
            <button type="button" className="inline-flex items-center gap-1 text-small text-text-muted">
              Más cercanos <ArrowDown size={12} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-surface p-5 md:p-8">
            <SearchX size={40} strokeWidth={1.5} aria-hidden="true" className="mx-auto mt-4 text-primary" />
            <h3 className="mt-10 text-heading-md font-semibold text-text md:px-3 lg:mt-12">No encontramos ese equipo.</h3>
            <p className="mt-5 text-body-lg text-text-muted md:px-3">
              Prueba con otro nombre, amplía la distancia o elimina los filtros para ver más opciones cerca de Yopal.
            </p>
            <div className="mt-8 space-y-3 md:px-3">
              <Button type="reset" size="lg" fullWidth>Restablecer todos los filtros</Button>
              <Button as={Link} to="/catalogo" variant="secondary" size="lg" fullWidth>Explorar todas las categorías</Button>
            </div>
            <div className="h-4 md:h-5" aria-hidden="true" />
          </div>

          <p className="mt-6 text-small text-text-muted">
            La búsqueda se conserva para que puedas ajustarla. No hay equipos que coincidan con “Grúa telescópica” a 5 km.
          </p>
        </section>
      </div>
    </PaginaCuenta>
  );
}
