import { Link } from 'react-router-dom';
import { Ban, Trash2, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Estadistica from '../components/Estadistica';
import {
  CabeceraAdmin,
  PestanasAdmin,
  FiltrosMovil,
  FiltrosEscritorio,
  PieListado,
  MiniaturaFila,
  EstadoInsignia,
} from '../components/AdminComunes';
import { COLUMNAS_TABLA, estadosUsuario, resumenUsuarios, usuarios } from '../data/moderacion';

const ESTADOS = ['Activo', 'Suspendido', 'Eliminado'];

function FilaUsuario({ item }) {
  const { nombre, detalle, rol, municipio, estado, destacada, accion, to } = item;
  return (
    <li className="rounded-2xl border border-border bg-surface lg:rounded-none lg:border-0 lg:border-t">
      {/* Móvil: tarjeta */}
      <div className="p-5 lg:hidden">
        <h3 className="text-heading-md font-semibold text-text">{nombre}</h3>
        <p className="mt-4 text-small text-text-muted">{detalle}</p>
        <p className="mt-4 text-small text-text-muted">{rol} · {municipio}</p>
        <EstadoInsignia catalogo={estadosUsuario} estado={estado} className="mt-4" />
        <Button as={Link} to={to} variant="secondary" size="lg" fullWidth className="mt-5">
          {accion} →
        </Button>
      </div>

      {/* Escritorio: fila de tabla */}
      <div className={`hidden items-center gap-4 px-6 py-4 lg:grid ${COLUMNAS_TABLA} ${destacada ? 'bg-surface-muted' : ''}`}>
        <div className="flex min-w-0 items-center gap-4">
          <MiniaturaFila usuario />
          <div className="min-w-0">
            <p className="text-body font-semibold text-text">{nombre}</p>
            <p className="mt-1 truncate text-caption text-text-muted">{detalle}</p>
          </div>
        </div>
        <span className="text-small text-text-muted">{rol}</span>
        <span className="text-small text-text-muted">{municipio}</span>
        <div><EstadoInsignia catalogo={estadosUsuario} estado={estado} /></div>
        <Link to={to} className="text-small font-semibold text-text">{accion} →</Link>
      </div>
    </li>
  );
}

export default function AdminUsuariosPage() {
  return (
    <DashboardLayout rol="admin" activo="usuarios">
      <CabeceraAdmin seccion="Usuarios" titulo="Una comunidad de confianza." subtitulo="Gestiona los perfiles y su estado en la plataforma." />

      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={resumenUsuarios.activos} etiqueta="Usuarios activos" etiquetaMovil="Activos" icono={Users} />
        <Estadistica valor={resumenUsuarios.suspendidos} etiqueta="Suspendidos" icono={Users} />
        <Estadistica valor={resumenUsuarios.eliminados} etiqueta="Eliminados" icono={Users} />
      </div>

      <PestanasAdmin activa="usuarios" />
      <FiltrosMovil id="buscar-usuario" etiqueta="Buscar usuario" placeholder="Buscar nombre o correo" estados={ESTADOS} />

      <section aria-label="Usuarios" className="mt-5 lg:mt-6 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-surface">
        <FiltrosEscritorio id="buscar-usuario" placeholder="Buscar nombre o correo" estados={ESTADOS} />

        <div className={`hidden bg-surface-muted px-6 py-3 text-caption font-medium uppercase tracking-wide text-text-muted lg:grid lg:gap-4 ${COLUMNAS_TABLA}`}>
          <span>Usuario</span>
          <span>Rol</span>
          <span>Municipio</span>
          <span>Estado</span>
          <span>Acción</span>
        </div>

        <ul className="space-y-5 lg:space-y-0">
          {usuarios.map((item) => (
            <FilaUsuario key={item.id} item={item} />
          ))}
        </ul>

        <PieListado resumen="Mostrando 5 de 257 usuarios" paginas={52} />
      </section>

      {/* Usuario seleccionado */}
      <section aria-label="Usuario seleccionado" className="mt-6 rounded-2xl bg-surface-muted p-5 lg:flex lg:items-start lg:justify-between lg:gap-10 lg:border lg:border-border lg:bg-surface lg:p-6">
        <div className="min-w-0 lg:max-w-[620px]">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-heading-md font-semibold text-text lg:text-heading-lg">
              Pablo Ortega<span className="lg:hidden"> · Seleccionado</span>
            </h2>
            <span className="hidden lg:inline-flex"><Badge tone="success">Activo</Badge></span>
          </div>
          <p className="mt-4 text-body-lg text-text-muted lg:mt-3 lg:text-body">
            Una publicación en revisión por posible uso de fotografías ajenas.<span className="hidden lg:inline"> Suspender restringe el acceso a su cuenta; eliminar retira el perfil definitivamente.</span>
          </p>
          <p className="mt-4 text-small text-text-muted">
            Reporte REP-108 · En revisión por Andrea Pérez
          </p>
        </div>

        <div className="mt-5 lg:mt-0 lg:w-[236px] lg:shrink-0">
          <div className="flex flex-col gap-3">
            <Button type="button" variant="secondary" size="lg" icon={Ban}>Suspender usuario</Button>
            <Button type="button" variant="danger" size="lg" icon={Trash2}>Eliminar usuario</Button>
          </div>
          <p className="mt-4 text-small text-text-muted">
            <span className="lg:hidden">Suspender restringe el acceso de forma reversible. Eliminar retira el perfil definitivamente. </span>
            Ambas acciones requieren motivo y confirmación.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
