import { Link } from 'react-router-dom';
import { Ban, Tractor, Trash2, TriangleAlert } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Estadistica from '../components/Estadistica';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import {
  CabeceraAdmin,
  PestanasAdmin,
  FiltrosMovil,
  FiltrosEscritorio,
  PieListado,
  MiniaturaFila,
  EstadoInsignia,
} from '../components/AdminComunes';
import { COLUMNAS_TABLA, estadosPublicacion, publicaciones, resumenPublicaciones } from '../data/moderacion';

const ESTADOS = ['Visible', 'En revisión', 'Suspendida', 'Eliminada'];

function FilaPublicacion({ item }) {
  const { nombre, detalle, categoria, actualizacion, estado, foto, destacada, accion, to } = item;
  return (
    <li className="rounded-2xl border border-border bg-surface lg:rounded-none lg:border-0 lg:border-t">
      {/* Móvil: tarjeta */}
      <div className="p-5 lg:hidden">
        {foto && <ImagenNoEncontrada className="mb-5 aspect-[16/7] w-full rounded-xl" />}
        <h3 className="text-heading-md font-semibold text-text">{nombre}</h3>
        <p className="mt-4 text-small text-text-muted">{detalle}</p>
        <p className="mt-3 text-small text-text-muted">Actualización: {actualizacion}</p>
        <EstadoInsignia catalogo={estadosPublicacion} estado={estado} className="mt-4" />
        <Button as={Link} to={to} variant="secondary" size="lg" fullWidth className="mt-5">
          {accion} →
        </Button>
      </div>

      {/* Escritorio: fila de tabla */}
      <div className={`hidden items-center gap-4 px-6 py-4 lg:grid ${COLUMNAS_TABLA} ${destacada ? 'bg-surface-muted' : ''}`}>
        <div className="flex min-w-0 items-center gap-4">
          <MiniaturaFila foto={foto} />
          <div className="min-w-0">
            <p className="text-body font-semibold text-text">{nombre}</p>
            <p className="mt-1 text-caption text-text-muted">{detalle}</p>
          </div>
        </div>
        <span className="text-small text-text-muted">{categoria}</span>
        <span className="text-small text-text-muted">{actualizacion}</span>
        <div><EstadoInsignia catalogo={estadosPublicacion} estado={estado} /></div>
        <Link to={to} className="text-small font-semibold text-text">{accion} →</Link>
      </div>
    </li>
  );
}

export default function AdminPublicacionesPage() {
  return (
    <DashboardLayout rol="admin" activo="publicaciones">
      <CabeceraAdmin seccion="Publicaciones" titulo="Publicaciones claras y confiables." subtitulo="Revisa equipos y retira contenido que incumpla las normas." />

      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={resumenPublicaciones.visibles} etiqueta="Publicaciones visibles" etiquetaMovil="Visibles" icono={Tractor} />
        <Estadistica valor={resumenPublicaciones.revision} etiqueta="En revisión" icono={Tractor} />
        <Estadistica valor={resumenPublicaciones.suspendidas} etiqueta="Suspendidas" icono={Tractor} />
      </div>

      <PestanasAdmin activa="publicaciones" />
      <FiltrosMovil id="buscar-publicacion" etiqueta="Buscar publicación" placeholder="Buscar equipo o propietario" estados={ESTADOS} />

      <section aria-label="Publicaciones" className="mt-5 lg:mt-6 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-surface">
        <FiltrosEscritorio id="buscar-publicacion" placeholder="Buscar equipo o propietario" estados={ESTADOS} />

        <div className={`hidden bg-surface-muted px-6 py-3 text-caption font-medium uppercase tracking-wide text-text-muted lg:grid lg:gap-4 ${COLUMNAS_TABLA}`}>
          <span>Publicación</span>
          <span>Categoría</span>
          <span>Actualización</span>
          <span>Estado</span>
          <span>Acción</span>
        </div>

        <ul className="space-y-5 lg:space-y-0">
          {publicaciones.map((item) => (
            <FilaPublicacion key={item.id} item={item} />
          ))}
        </ul>

        <PieListado resumen="Mostrando 5 de 73 publicaciones" paginas={15} />
      </section>

      {/* Caso seleccionado */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Publicación seleccionada" className="rounded-2xl bg-surface-muted p-5 lg:border lg:border-border lg:bg-surface lg:p-6">
          <div className="flex items-start gap-3">
            <Tractor size={22} aria-hidden="true" className="mt-1 shrink-0 text-text lg:hidden" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-heading-md font-semibold text-text">Cargador frontal</h2>
                <span className="hidden lg:inline-flex"><Badge tone="warning">En revisión</Badge></span>
              </div>
              <p className="mt-2 text-small text-text-muted">
                Pablo Ortega · Aguazul<span className="hidden lg:inline"> · Reporte REP-108</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-small text-text-muted lg:hidden">Reporte REP-108 · En revisión</p>
          <p className="mt-4 text-body-lg text-text-muted lg:text-body">
            Posible uso de fotografías ajenas. Revisa el reporte antes de tomar una decisión.
          </p>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <Button as={Link} to="/admin/reportes" variant="secondary" size="lg" className="lg:px-6">Ver reporte</Button>
            <Button type="button" variant="secondary" size="lg" icon={Ban} className="lg:hidden">Suspender publicación</Button>
            <div className="hidden lg:block"><Button type="button" variant="danger" size="lg" icon={Ban} className="lg:px-6">Suspender publicación</Button></div>
            <Button type="button" variant="danger" size="lg" icon={Trash2} className="lg:hidden">Eliminar publicación</Button>
          </div>
          <p className="mt-4 text-small text-text-muted lg:hidden">Se solicitará motivo y confirmación. Eliminar es irreversible.</p>
        </section>

        <Card tone="danger" className="hidden lg:block lg:p-6" aria-label="Confirmar eliminación">
          <h2 className="flex items-center gap-2 text-heading-sm font-semibold text-danger">
            <TriangleAlert size={18} aria-hidden="true" /> ¿Eliminar esta publicación?
          </h2>
          <p className="mt-3 text-small text-danger">
            “Cargador frontal” se retirará de forma definitiva. Esta acción no se puede deshacer.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Button type="button" variant="secondary" size="lg" className="px-6">Cancelar</Button>
            <button type="button" className="inline-flex h-12 items-center gap-2 px-4 text-label font-semibold text-danger">
              <Trash2 size={16} aria-hidden="true" /> Sí, eliminar
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
