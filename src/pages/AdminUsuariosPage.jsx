import { useEffect, useMemo, useState } from 'react';
import { Ban, Check, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Estadistica from '../components/Estadistica';
import Textarea from '../components/Textarea';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { CabeceraAdmin, PestanasAdmin } from '../components/AdminComunes';
import { loadAdminOverview, updateAdminUserStatus } from '../services/adminService';

const statusLabel = { activo: 'Activo', suspendido: 'Suspendido', eliminado: 'Eliminado' };
const statusTone = { activo: 'success', suspendido: 'danger', eliminado: 'neutral' };

export default function AdminUsuariosPage() {
  const [data, setData] = useState({ users: [] });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('todos');
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const reload = () => loadAdminOverview({ includeProfilePhotos: true })
    .then(setData)
    .catch((loadError) => setError(loadError.message))
    .finally(() => setLoading(false));
  useEffect(() => { reload(); }, []);
  const users = useMemo(() => data.users.filter((user) => {
    const term = search.trim().toLowerCase();
    return (!term || `${user.full_name} ${user.email}`.toLowerCase().includes(term))
      && (status === 'todos' || user.status === status);
  }), [data.users, search, status]);
  const counts = {
    activo: data.users.filter((user) => user.status === 'activo').length,
    suspendido: data.users.filter((user) => user.status === 'suspendido').length,
    eliminado: data.users.filter((user) => user.status === 'eliminado').length,
  };
  const selected = data.users.find((user) => user.id === selectedId);

  const changeStatus = async (nextStatus) => {
    if (!selected || selected.role === 'admin') return;
    if (nextStatus === 'suspendido' && suspensionReason.trim().length < 10) {
      setError('Escribe un motivo de al menos 10 caracteres antes de suspender la cuenta.');
      return;
    }
    const action = nextStatus === 'eliminado' ? 'eliminar' : nextStatus === 'suspendido' ? 'suspender' : 'reactivar';
    const accountStatusWarning = ['eliminado', 'suspendido'].includes(nextStatus)
      ? `\n\nEl contenido asociado se conservará, pero quedará oculto mientras la cuenta esté ${nextStatus === 'eliminado' ? 'eliminada' : 'suspendida'}.`
      : '';
    if (!window.confirm(`¿Confirmas ${action} a ${selected.full_name}?${accountStatusWarning}`)) return;
    setSaving(true); setError('');
    try {
      await updateAdminUserStatus(selected.id, nextStatus, { reason: suspensionReason, reviewerId: profile?.id });
      setSuspensionReason('');
      await reload();
    }
    catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout rol="admin" activo="usuarios">
      <CabeceraAdmin seccion="Usuarios" titulo="Una comunidad de confianza." subtitulo="Gestiona los perfiles y su estado en la plataforma." />
      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={counts.activo} etiqueta="Usuarios activos" icono={Users} />
        <Estadistica valor={counts.suspendido} etiqueta="Suspendidos" icono={Users} />
        <Estadistica valor={counts.eliminado} etiqueta="Eliminados" icono={Users} />
      </div>
      <PestanasAdmin activa="usuarios" reportCount={(data.reports || []).filter((report) => report.status !== 'resuelto').length} />
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input aria-label="Buscar usuario" placeholder="Buscar nombre o correo" value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 flex-1 rounded-lg border border-border bg-surface px-4 text-label" />
        <select aria-label="Filtrar usuarios por estado" value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-lg border border-border bg-surface px-4 text-label">
          <option value="todos">Todos los estados</option><option value="activo">Activos</option><option value="suspendido">Suspendidos</option><option value="eliminado">Eliminados</option>
        </select>
      </div>
      {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
      {loading && <p role="status" aria-live="polite" className="mt-4 text-small text-text-muted">Cargando usuarios…</p>}
      <section aria-label="Usuarios" className="mt-5 grid gap-3">
        {users.map((user) => (
          <button type="button" key={user.id} onClick={() => { setSelectedId(user.id); setSuspensionReason(''); setError(''); }} className={`text-left ${selectedId === user.id ? 'ring-2 ring-primary' : ''}`}>
            <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar src={user.avatar_url} alt={`Foto de ${user.full_name}`} className="size-12" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">{user.full_name}</p>
                  <p className="truncate text-small text-text-muted">{user.email} · {user.role} · {user.municipality || 'Sin municipio'}</p>
                </div>
              </div>
              <Badge tone={statusTone[user.status]}>{statusLabel[user.status]}</Badge>
            </Card>
          </button>
        ))}
        {!loading && !error && !users.length && <Card><p className="text-body text-text-muted">No hay usuarios que coincidan con el filtro.</p></Card>}
      </section>
      {selected && (
        <Card className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar src={selected.avatar_url} alt={`Foto de ${selected.full_name}`} className="size-20" />
            <div className="min-w-0">
              <p className="text-caption uppercase text-text-muted">Perfil seleccionado</p>
              <h2 className="mt-1 text-heading-md font-semibold text-text">{selected.full_name}</h2>
              <p className="mt-1 break-all text-small text-text-muted">{selected.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="neutral">{selected.role}</Badge>
                <Badge tone={statusTone[selected.status]}>{statusLabel[selected.status]}</Badge>
              </div>
            </div>
          </div>
          <dl className="mt-5 grid gap-4 rounded-xl bg-surface-muted p-4 sm:grid-cols-2">
            <div><dt className="text-caption font-semibold text-text-muted">Teléfono</dt><dd className="mt-1 text-small text-text">{selected.phone || 'No registrado'}</dd></div>
            <div><dt className="text-caption font-semibold text-text-muted">Municipio</dt><dd className="mt-1 text-small text-text">{selected.municipality || 'No registrado'}</dd></div>
            <div><dt className="text-caption font-semibold text-text-muted">En Rentia desde</dt><dd className="mt-1 text-small text-text">{new Date(selected.created_at).toLocaleDateString('es-CO')}</dd></div>
          </dl>
          {selected.status === 'suspendido' && (
            <div className="mt-4 rounded-xl bg-surface-muted p-4">
              <p className="text-small font-semibold text-text">Motivo comunicado</p>
              <p className="mt-2 whitespace-pre-wrap text-small text-text-muted">{selected.suspension_reason || 'No quedó registrado un motivo para esta suspensión anterior.'}</p>
              {selected.suspended_at && <p className="mt-2 text-caption text-text-muted">Suspendida el {new Date(selected.suspended_at).toLocaleString('es-CO')}</p>}
              <p className="mt-3 text-small text-text-muted">El contenido asociado se conserva y permanece oculto mientras dure la suspensión.</p>
            </div>
          )}
          {selected.status === 'eliminado' && (
            <p className="mt-4 text-small text-text-muted">El perfil y su contenido se conservan; el contenido está oculto por el estado de cuenta eliminada.</p>
          )}
          {selected.status === 'activo' && selected.role !== 'admin' && (
            <Textarea
              id="motivo-suspension"
              label="Motivo obligatorio de suspensión"
              rows={3}
              minLength={10}
              maxLength={2000}
              value={suspensionReason}
              onChange={(event) => setSuspensionReason(event.target.value)}
              className="mt-5"
              hint="Se mostrará a la persona para que entienda la medida y pueda apelarla."
            />
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {selected.status === 'activo' && <Button type="button" variant="secondary" icon={Ban} disabled={saving || suspensionReason.trim().length < 10} onClick={() => changeStatus('suspendido')}>Suspender</Button>}
            {selected.status === 'suspendido' && <Button type="button" icon={Check} disabled={saving} onClick={() => changeStatus('activo')}>Reactivar</Button>}
            {selected.status !== 'eliminado' && selected.role !== 'admin' && <Button type="button" variant="danger" disabled={saving} onClick={() => changeStatus('eliminado')}>Eliminar</Button>}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
