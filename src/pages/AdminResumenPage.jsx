import { useEffect, useState } from 'react';
import { Activity, ArrowRight, Flag, ShieldAlert, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Estadistica from '../components/Estadistica';
import { CabeceraAdmin } from '../components/AdminComunes';
import { loadAdminDashboard } from '../services/adminService';

const reportStatus = {
  pendiente: { label: 'Pendiente', tone: 'warning' },
  revision: { label: 'En revisión', tone: 'warning' },
};
const publicationBreakdown = [
  { key: 'published', label: 'Visibles', color: 'bg-success' },
  { key: 'review', label: 'En revisión', color: 'bg-warning' },
  { key: 'drafts', label: 'Borradores', color: 'bg-accent' },
  { key: 'suspended', label: 'Suspendidas', color: 'bg-danger' },
  { key: 'hidden', label: 'Ocultas', color: 'bg-text-muted' },
  { key: 'deleted', label: 'Retiradas', color: 'bg-surface-selected' },
];

function BarraProporcion({ label, value, total, color }) {
  const width = total ? Math.max(value ? 4 : 0, (value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-small">
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold tabular-nums text-text">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted" role="img" aria-label={`${label}: ${value} de ${total}`}>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function AccionAtencion({ icon: Icon, label, count, to, detail, tone = 'default' }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone === 'urgent' ? 'bg-danger-subtle text-danger' : 'bg-surface-muted text-text'}`}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-text">{label}</span>
        <span className="mt-1 block text-small text-text-muted">{detail}</span>
      </span>
      <span className={`text-heading-md font-semibold tabular-nums ${tone === 'urgent' && count ? 'text-danger' : 'text-text'}`}>{count}</span>
      <ArrowRight size={16} aria-hidden="true" className="text-text-muted transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function Actividad7Dias({ activity = [] }) {
  const max = Math.max(1, ...activity.map((day) => day.users + day.listings));
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Actividad reciente</p>
          <h2 className="mt-2 text-heading-md font-semibold text-text">Crecimiento de la comunidad</h2>
          <p className="mt-1 text-small text-text-muted">Registros y equipos creados en los últimos 7 días</p>
        </div>
        <Activity size={20} aria-hidden="true" className="hidden text-primary sm:block" />
      </div>
      <div className="mt-6 flex items-end gap-2 sm:gap-3" role="img" aria-label="Registros y publicaciones creados durante los últimos siete días">
        {activity.map((day) => (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1" key={day.date}>
            <div className="flex h-28 w-full items-end justify-center gap-1 rounded-t-md bg-surface-muted px-1">
              <div className="w-1/2 rounded-t-sm bg-primary/45" title={`${day.users} usuarios`} style={{ height: `${Math.max(day.users ? 8 : 3, (day.users / max) * 100)}%` }} />
              <div className="w-1/2 rounded-t-sm bg-accent" title={`${day.listings} equipos`} style={{ height: `${Math.max(day.listings ? 8 : 3, (day.listings / max) * 100)}%` }} />
            </div>
            <span className="text-[11px] text-text-muted">{day.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-small text-text-muted">
        <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-sm bg-primary/45" />Usuarios nuevos</span>
        <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-sm bg-accent" />Equipos publicados</span>
      </div>
    </Card>
  );
}

export default function AdminResumenPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    loadAdminDashboard().then(setData).catch((loadError) => setError(loadError.message));
  }, []);

  if (error) {
    return (
      <DashboardLayout rol="admin" activo="resumen">
        <CabeceraAdmin seccion="Resumen" titulo="El centro de control de Rentia." subtitulo="Una vista clara para cuidar la comunidad." />
        <p role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger-subtle p-4 text-small text-danger">{error}</p>
      </DashboardLayout>
    );
  }

  const totals = data || {
    users: { total: 0, clients: 0, landlords: 0, active: 0, suspended: 0, new30d: 0 },
    equipment: { total: 0, published: 0, drafts: 0, suspended: 0, new30d: 0 },
    reports: { pending: 0, inReview: 0, resolved: 0, recent: [] },
  };
  const totalRoleUsers = totals.users.clients + totals.users.landlords;
  const activeReports = totals.reports.pending + totals.reports.inReview;
  const publicationCount = totals.equipment.total;
  const recent = totals.reports.recent.slice(0, 4);

  return (
    <DashboardLayout rol="admin" activo="resumen">
      <CabeceraAdmin seccion="Resumen" titulo="El centro de control de Rentia." subtitulo="Una vista clara para cuidar la comunidad y mantener el mercado confiable." />

      <section aria-label="Indicadores clave" className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        <Estadistica valor={data ? totals.users.total : '—'} etiqueta="Usuarios registrados" icono={Users} />
        <Estadistica valor={data ? totals.equipment.published : '—'} etiqueta="Equipos visibles" icono={Store} />
        <Estadistica valor={data ? activeReports : '—'} etiqueta="Casos por atender" icono={Flag} />
        <Estadistica valor={data ? totals.users.suspended : '—'} etiqueta="Cuentas suspendidas" icono={ShieldAlert} />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-surface via-surface to-primary-alpha-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wider text-primary">Pulso de la comunidad · últimos 30 días</p>
              <h2 className="mt-3 max-w-xl text-heading-lg font-semibold leading-tight text-text md:text-title-mobile">Rentia crece cuando cada publicación y cada interacción generan confianza.</h2>
            </div>
            <Link to="/admin/reportes" className="inline-flex shrink-0 items-center gap-2 text-label font-semibold text-primary">
              Revisar casos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-xl border border-border bg-surface/80 p-4">
              <p className="text-title-mobile font-semibold tabular-nums text-text">{data ? `+${totals.users.new30d}` : '—'}</p>
              <p className="mt-1 text-small text-text-muted">nuevos usuarios</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/80 p-4">
              <p className="text-title-mobile font-semibold tabular-nums text-text">{data ? `+${totals.equipment.new30d}` : '—'}</p>
              <p className="mt-1 text-small text-text-muted">nuevos equipos</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Cola de moderación</p>
              <h2 className="mt-2 text-heading-md font-semibold text-text">Atención prioritaria</h2>
            </div>
            <Badge tone={activeReports ? 'warning' : 'success'}>{activeReports ? `${activeReports} abiertos` : 'Al día'}</Badge>
          </div>
          <div className="mt-5 space-y-3">
            <AccionAtencion icon={Flag} label="Reportes pendientes" count={totals.reports.pending} to="/admin/reportes" detail="Revisar contenido reportado" tone="urgent" />
            <AccionAtencion icon={Activity} label="En revisión" count={totals.reports.inReview} to="/admin/reportes" detail="Casos que ya están siendo atendidos" />
            <AccionAtencion icon={ShieldAlert} label="Cuentas suspendidas" count={totals.users.suspended} to="/admin/usuarios" detail="Ver estado y tomar acción" />
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Comunidad activa</p>
          <h2 className="mt-2 text-heading-md font-semibold text-text">Quiénes hacen Rentia</h2>
          <p className="mt-1 text-small text-text-muted">{totalRoleUsers} perfiles activos con rol operativo</p>
          <div className="mt-6 space-y-5">
            <BarraProporcion label="Clientes" value={totals.users.clients} total={totalRoleUsers} color="bg-primary" />
            <BarraProporcion label="Arrendadores" value={totals.users.landlords} total={totalRoleUsers} color="bg-accent" />
          </div>
          <Link to="/admin/usuarios" className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-primary">Gestionar usuarios <ArrowRight size={14} aria-hidden="true" /></Link>
        </Card>
        <Card>
          <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Inventario de equipos</p>
          <h2 className="mt-2 text-heading-md font-semibold text-text">Estado del catálogo</h2>
          <p className="mt-1 text-small text-text-muted">{publicationCount} publicaciones registradas</p>
          <div className="mt-6 space-y-5">
            {publicationBreakdown.map(({ key, label, color }) => (
              <BarraProporcion key={key} label={label} value={totals.equipment[key]} total={publicationCount} color={color} />
            ))}
          </div>
          <Link to="/admin/publicaciones" className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-primary">Gestionar publicaciones <ArrowRight size={14} aria-hidden="true" /></Link>
        </Card>
        <Actividad7Dias activity={data ? totals.activity : []} />
      </section>

      <section className="mt-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Actividad reciente</p>
            <h2 className="mt-1 text-heading-md font-semibold text-text">Reportes que requieren contexto</h2>
          </div>
          <Link to="/admin/reportes" className="inline-flex items-center gap-1 text-small font-semibold text-primary">Ver todos <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {recent.map((report) => {
            const state = reportStatus[report.status] || { label: report.status, tone: 'neutral' };
            return (
              <Link to="/admin/reportes" key={report.id} className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <Card className="h-full transition-colors hover:bg-surface-muted">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-text">{report.reason}</p>
                      <p className="mt-1 text-small text-text-muted">{report.equipment?.name || (report.review ? 'Valoración reportada' : 'Contenido')} · {report.reporter?.full_name || 'Usuario'}</p>
                    </div>
                    <Badge tone={state.tone}>{state.label}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-small text-text-muted">{report.description || report.review?.comment || 'Sin descripción adicional.'}</p>
                </Card>
              </Link>
            );
          })}
          {data && recent.length === 0 && <Card className="md:col-span-2"><p className="text-body text-text-muted">No hay reportes abiertos. La cola de moderación está al día.</p></Card>}
          {!data && <Card className="md:col-span-2"><p className="text-body text-text-muted" aria-live="polite">Cargando resumen de Rentia…</p></Card>}
        </div>
      </section>
    </DashboardLayout>
  );
}
