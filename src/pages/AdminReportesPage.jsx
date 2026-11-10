import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Flag, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Estadistica from '../components/Estadistica';
import Textarea from '../components/Textarea';
import { CabeceraAdmin, PestanasAdmin } from '../components/AdminComunes';
import { useAuth } from '../context/AuthContext';
import { loadAdminOverview, setAdminReviewVisibility, updateAdminEquipmentStatus, updateAdminReport } from '../services/adminService';

const labels = { pendiente: 'Pendiente', revision: 'En revisión', resuelto: 'Resuelto' };
const tones = { pendiente: 'warning', revision: 'warning', resuelto: 'success' };

export default function AdminReportesPage() {
  const [data, setData] = useState({ reports: [] });
  const [selectedId, setSelectedId] = useState('');
  const [note, setNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { profile } = useAuth();
  const reload = useCallback(() => loadAdminOverview().then((nextData) => { setData(nextData); setSelectedId((current) => current || nextData.reports[0]?.id || ''); }).catch((loadError) => setError(loadError.message)), []);
  useEffect(() => { reload(); }, [reload]);
  const reports = useMemo(() => data.reports.filter((report) => statusFilter === 'todos' || report.status === statusFilter), [data.reports, statusFilter]);
  const selected = reports.find((report) => report.id === selectedId) || reports[0];
  const counts = {
    pendiente: data.reports.filter((report) => report.status === 'pendiente').length,
    revision: data.reports.filter((report) => report.status === 'revision').length,
    resuelto: data.reports.filter((report) => report.status === 'resuelto').length,
  };
  const resolve = async (action) => {
    if (!selected) return;
    if (action === 'resolve' && !note.trim()) {
      setError('Agrega una nota antes de resolver el reporte.');
      return;
    }
    setSaving(true); setError('');
    try {
      if (action === 'hide') {
        await updateAdminReport(selected.id, 'revision', note, profile?.id);
        if (selected.equipment?.id) await updateAdminEquipmentStatus(selected.equipment.id, 'suspendida');
      } else {
        await updateAdminReport(selected.id, action === 'take' ? 'revision' : 'resuelto', note, profile?.id);
      }
      await reload();
    } catch (saveError) {
      await reload();
      setError(saveError.message);
    }
    finally { setSaving(false); }
  };
  const changeReviewVisibility = async (isPublished) => {
    if (!selected?.review?.id) return;
    setSaving(true); setError('');
    try {
      await setAdminReviewVisibility(selected.review.id, isPublished);
      await reload();
    } catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  };
  return (
    <DashboardLayout rol="admin" activo="reportes">
      <CabeceraAdmin seccion="Reportes" titulo="Escuchar. Revisar. Actuar." subtitulo="Da respuesta a los reportes de la comunidad." />
      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5"><Estadistica valor={counts.pendiente} etiqueta="Pendientes" icono={Flag} /><Estadistica valor={counts.revision} etiqueta="En revisión" icono={Flag} /><Estadistica valor={counts.resuelto} etiqueta="Resueltos" icono={Flag} /></div>
      <PestanasAdmin activa="reportes" reportCount={counts.pendiente + counts.revision} />
      {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
      <label className="mt-5 block max-w-sm text-label font-semibold text-text">
        Filtrar reportes
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-4 font-normal">
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="revision">En revisión</option>
          <option value="resuelto">Resueltos</option>
        </select>
      </label>
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)]">
        <section aria-label="Reportes recientes" className="grid gap-3">{reports.map((report) => <button type="button" key={report.id} onClick={() => { setSelectedId(report.id); setNote(report.resolution_note || ''); }} className={`text-left ${selected?.id === report.id ? 'ring-2 ring-primary' : ''}`}><Card className="p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-text">{report.reason}</p><Badge tone={tones[report.status]}>{labels[report.status]}</Badge></div><p className="mt-2 text-small text-text-muted">{report.equipment?.name || (report.review ? 'Valoración reportada' : 'Contenido')} · {report.reporter?.full_name || 'Usuario'}</p><p className="mt-2 text-caption text-text-muted">{new Date(report.created_at).toLocaleString('es-CO')}</p></Card></button>)}{!reports.length && <Card><p className="text-body text-text-muted">No hay reportes registrados.</p></Card>}</section>
        {selected && <Card>
          <p className="text-caption uppercase text-text-muted">Reporte seleccionado</p>
          <h2 className="mt-2 text-heading-md font-semibold text-text">{selected.reason}</h2>
          <p className="mt-3 text-body text-text-muted">{selected.description || 'Sin descripción.'}</p>
          <p className="mt-4 text-small text-text-muted">Reportado por {selected.reporter?.full_name || 'usuario'} · {selected.equipment?.name || (selected.review ? 'Valoración' : 'Contenido')}</p>
          {selected.review && (
            <section className="mt-5 rounded-xl border border-border bg-surface-muted p-4" aria-label="Valoración reportada">
              <p className="font-semibold text-text">Valoración · {selected.review.rating}/5</p>
              <p className="mt-2 text-small text-text-muted">{selected.review.comment}</p>
              <p className="mt-2 text-caption text-text-muted">Visibilidad: {selected.review.is_published ? 'Pública' : 'Oculta'}</p>
              <Button type="button" variant="secondary" icon={selected.review.is_published ? EyeOff : Eye} disabled={saving} className="mt-4" onClick={() => changeReviewVisibility(!selected.review.is_published)}>
                {selected.review.is_published ? 'Ocultar valoración' : 'Restaurar valoración'}
              </Button>
            </section>
          )}
          <Textarea id="nota-admin" label="Nota interna de moderación" rows={4} value={note} onChange={(event) => setNote(event.target.value)} className="mt-6" />
          <div className="mt-5 flex flex-wrap gap-3">
            {selected.status === 'pendiente' && <Button type="button" variant="secondary" disabled={saving} onClick={() => resolve('take')}>Tomar caso</Button>}
            {selected.status !== 'resuelto' && selected.equipment?.id && <Button type="button" variant="secondary" icon={EyeOff} disabled={saving} onClick={() => resolve('hide')}>Ocultar publicación</Button>}
            {selected.status !== 'resuelto' && <Button type="button" icon={Check} disabled={saving} onClick={() => resolve('resolve')}>Marcar resuelto</Button>}
          </div>
          {selected.reviewed_by && <p className="mt-4 text-caption text-text-muted">Revisado por {selected.reviewer?.full_name || 'administración'}{selected.reviewed_at ? ` · ${new Date(selected.reviewed_at).toLocaleString('es-CO')}` : ''}.</p>}
        </Card>}
      </div>
    </DashboardLayout>
  );
}
