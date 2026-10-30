import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Ban, Check, Flag, History, Trash2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Estadistica from '../components/Estadistica';
import InfoBox from '../components/InfoBox';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import TileEquipo from '../components/TileEquipo';
import { CabeceraAdmin, PestanasAdmin, EstadoInsignia } from '../components/AdminComunes';
import { estadosReporte, reportes, resumenReportes } from '../data/moderacion';

function TarjetaReporte({ reporte }) {
  const { id, fechaWeb, fechaMovil, titulo, equipo, municipio, estado, nota, seleccionado } = reporte;
  return (
    <li>
      <article
        className={`rounded-2xl border p-5 ${
          seleccionado ? 'border-transparent bg-surface-muted lg:border-primary' : 'border-border bg-surface'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-small text-text-muted lg:text-caption">
            {id} · <span className="lg:hidden">{fechaMovil}</span>
            <span className="hidden lg:inline">{fechaWeb}</span>
          </p>
          <ArrowUpRight size={14} aria-hidden="true" className="hidden shrink-0 text-text lg:block" />
        </div>
        <h3 className="mt-4 text-heading-md font-semibold text-text lg:mt-3 lg:text-heading-sm">{titulo}</h3>
        <p className="mt-3 text-small text-text-muted">{equipo} · {municipio}</p>
        <EstadoInsignia catalogo={estadosReporte} estado={estado} className="mt-4 lg:mt-3" />
        {nota && <p className="mt-3 hidden text-caption text-text-muted lg:block">{nota}</p>}

        <Button
          as={Link}
          to="/admin/reportes"
          variant="secondary"
          size="lg"
          fullWidth
          className="mt-5 lg:hidden"
        >
          {seleccionado ? (
            <>Caso seleccionado <ArrowDown size={14} aria-hidden="true" /></>
          ) : (
            'Ver detalle →'
          )}
        </Button>
      </article>
    </li>
  );
}

function DetalleReporte() {
  return (
    <section aria-label="Detalle del reporte REP-108" className="rounded-2xl border border-border bg-surface p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-label font-semibold uppercase tracking-wide text-text-muted lg:text-caption lg:font-medium">Reporte REP-108</p>
        <span className="hidden lg:inline-flex"><EstadoInsignia catalogo={estadosReporte} estado="revision" /></span>
      </div>
      <h2 className="mt-4 text-heading-lg font-semibold text-text lg:mt-5">Posible uso de fotografías ajenas</h2>
      <EstadoInsignia catalogo={estadosReporte} estado="revision" className="mt-4 lg:hidden" />

      <TileEquipo
        nombre="Cargador frontal"
        detalle="Pablo Ortega · Aguazul"
        externo
        iconoClassName="lg:bg-surface-selected"
        className="mt-5 lg:mt-6"
      />

      <p className="mt-6 text-body-lg font-semibold text-text-muted lg:text-small lg:text-text">Reportado por María López · Cliente</p>
      <p className="mt-3 text-small text-text-muted lg:mt-2 lg:text-caption">18 oct. 2026 · 09:40</p>
      <p className="mt-3 text-body-lg text-text-muted lg:text-body">
        “Las fotografías parecen corresponder a otro equipo publicado. No coinciden con la descripción ni con la ubicación indicada.”
      </p>

      <hr className="my-6 hidden border-border lg:block" />

      <Textarea
        id="nota-moderacion"
        label="Nota interna de moderación"
        rows={3}
        className="mt-6 lg:mt-0"
        defaultValue="Se identificaron imágenes coincidentes en otra publicación. Revisar origen y consistencia de los datos del propietario."
      />

      <InfoBox title="Trazabilidad" icon={History} className="mt-5 lg:hidden">
        Andrea Pérez tomó el caso · Hoy, 10:05
      </InfoBox>
      <p className="mt-5 hidden items-center gap-3 rounded-xl bg-surface-muted px-4 py-3 text-small text-text-muted lg:flex">
        <History size={16} aria-hidden="true" className="text-text" /> Andrea Pérez tomó el caso · Hoy, 10:05
      </p>

      <h3 className="mt-6 text-heading-md font-semibold text-text lg:text-heading-sm">Acciones de moderación</h3>
      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
        <Button type="button" variant="secondary" size="lg" className="lg:px-6">
          <Ban size={16} aria-hidden="true" className="hidden lg:block" /> Suspender publicación
        </Button>
        <Button as={Link} to="/admin/moderacion" variant="danger" size="lg" className="lg:px-6">
          <Trash2 size={16} aria-hidden="true" className="hidden lg:block" /> Eliminar publicación
        </Button>
      </div>
      <Button type="button" size="lg" fullWidth className="mt-3" icon={Check}>Marcar como resuelto</Button>
      <p className="mt-4 text-small text-text-muted lg:text-caption">
        Suspender oculta temporalmente. Eliminar lo retira definitivamente y requiere confirmación. Toda decisión queda registrada.
      </p>
    </section>
  );
}

export default function AdminReportesPage() {
  return (
    <DashboardLayout rol="admin" activo="reportes">
      <CabeceraAdmin seccion="Reportes" titulo="Escuchar. Revisar. Actuar." subtitulo="Da respuesta a los reportes de la comunidad." />

      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={resumenReportes.pendientes} etiqueta="Pendientes" icono={Flag} />
        <Estadistica valor={resumenReportes.revision} etiqueta="En revisión" icono={Flag} />
        <Estadistica valor={resumenReportes.resueltos} etiqueta="Resueltos" icono={Flag} />
      </div>

      <PestanasAdmin activa="reportes" />

      <Select id="filtrar-reportes" label="Filtrar reportes" defaultValue="todos" className="mt-6 lg:hidden">
        <option value="todos">Todos · Más recientes</option>
        <option>Pendientes</option>
        <option>En revisión</option>
        <option>Resueltos</option>
      </Select>

      <div className="mt-6 grid gap-5 lg:grid-cols-[370px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <section aria-labelledby="reportes-recientes">
          <div className="hidden items-center justify-between lg:flex">
            <h2 id="reportes-recientes" className="text-heading-sm font-semibold text-text">Reportes recientes</h2>
            <button type="button" className="inline-flex items-center gap-1 text-small text-text-muted">
              Más recientes <ArrowDown size={12} aria-hidden="true" />
            </button>
          </div>
          <ul className="space-y-5 lg:mt-4 lg:space-y-4">
            {reportes.map((reporte) => (
              <TarjetaReporte key={reporte.id} reporte={reporte} />
            ))}
          </ul>
        </section>

        <DetalleReporte />
      </div>
    </DashboardLayout>
  );
}
