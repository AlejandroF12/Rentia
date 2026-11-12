import { useEffect, useMemo, useState } from 'react';
import { Check, Scale, X } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import { CabeceraAdmin, PestanasAdmin } from '../components/AdminComunes';
import { loadAdminAccountAppeals, resolveAccountAppeal } from '../services/appealService';

const labels = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'No aprobada' };
const tones = { pendiente: 'warning', aceptada: 'success', rechazada: 'danger' };

export default function AdminApelacionesPage() {
  const [appeals, setAppeals] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState('pendiente');
  const [decisionNote, setDecisionNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const reload = async () => {
    const records = await loadAdminAccountAppeals();
    setAppeals(records);
    setSelectedId((current) => records.some((item) => item.id === current) ? current : records[0]?.id || '');
  };

  useEffect(() => {
    let active = true;
    loadAdminAccountAppeals()
      .then((records) => {
        if (!active) return;
        setAppeals(records);
        setSelectedId(records[0]?.id || '');
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredAppeals = useMemo(
    () => appeals.filter((appeal) => filter === 'todas' || appeal.status === filter),
    [appeals, filter],
  );
  const selected = filteredAppeals.find((appeal) => appeal.id === selectedId) || filteredAppeals[0];
  const pendingCount = appeals.filter((appeal) => appeal.status === 'pendiente').length;

  const decide = async (decision) => {
    if (!selected || selected.status !== 'pendiente') return;
    if (decisionNote.trim().length < 10) {
      setError('Escribe una respuesta de al menos 10 caracteres antes de resolver la solicitud.');
      return;
    }
    const verb = decision === 'aceptada' ? 'aceptar y reactivar la cuenta' : 'rechazar la solicitud';
    if (!window.confirm(`¿Confirmas ${verb} para ${selected.appellant?.full_name || 'esta persona'}?`)) return;
    setSaving(true);
    setError('');
    try {
      await resolveAccountAppeal(selected.id, decision, decisionNote);
      setDecisionNote('');
      await reload();
    } catch (saveError) {
      setError(saveError.message);
      try {
        await reload();
      } catch (reloadError) {
        setError(`${saveError.message} Además, no se pudo actualizar la lista: ${reloadError.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout rol="admin" activo="apelaciones">
      <CabeceraAdmin seccion="Apelaciones" titulo="Revisar con contexto y dejar constancia." subtitulo="Las apelaciones son privadas. Aceptar una reactiva la cuenta; rechazarla mantiene la suspensión." />
      <PestanasAdmin activa="apelaciones" appealCount={pendingCount} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <p className="text-small text-text-muted">{pendingCount} solicitud{pendingCount === 1 ? '' : 'es'} pendiente{pendingCount === 1 ? '' : 's'}</p>
        <Select id="appeal-status-filter" label="Filtrar por estado" value={filter} onChange={(event) => setFilter(event.target.value)} className="w-full sm:w-64">
          <option value="pendiente">Pendientes</option>
          <option value="aceptada">Aceptadas</option>
          <option value="rechazada">No aprobadas</option>
          <option value="todas">Todas</option>
        </Select>
      </div>

      {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
      {loading ? (
        <p className="mt-6 text-small text-text-muted" aria-busy="true">Cargando apelaciones…</p>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)]">
          <section aria-label="Solicitudes de revisión" className="grid content-start gap-3">
            {filteredAppeals.map((appeal) => (
              <button
                type="button"
                key={appeal.id}
                onClick={() => { setSelectedId(appeal.id); setDecisionNote(''); setError(''); }}
                className={`text-left ${selected?.id === appeal.id ? 'rounded-2xl ring-2 ring-primary' : ''}`}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-text">{appeal.appellant?.full_name || 'Cuenta'}</span>
                      <span className="mt-1 block truncate text-small text-text-muted">{appeal.appellant?.email || 'Correo no disponible'}</span>
                    </span>
                    <Badge tone={tones[appeal.status]}>{labels[appeal.status]}</Badge>
                  </div>
                  <span className="mt-3 block text-small text-text-muted">{appeal.reason}</span>
                  <span className="mt-2 block text-caption text-text-muted">{new Date(appeal.created_at).toLocaleString('es-CO')}</span>
                </Card>
              </button>
            ))}
            {!filteredAppeals.length && (
              <Card>
                <p className="text-body text-text-muted">{filter === 'pendiente' ? 'No hay apelaciones pendientes.' : 'No hay solicitudes para este filtro.'}</p>
              </Card>
            )}
          </section>

          {selected && (
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Solicitud de revisión</p>
                  <h2 className="mt-2 text-heading-md font-semibold text-text">{selected.appellant?.full_name || 'Cuenta'}</h2>
                  <p className="mt-1 text-small text-text-muted">{selected.appellant?.email} · {selected.appellant?.role}</p>
                </div>
                <Badge tone={tones[selected.status]}>{labels[selected.status]}</Badge>
              </div>
              <p className="mt-5 text-label font-semibold text-text">{selected.reason}</p>
              <p className="mt-2 whitespace-pre-wrap text-body leading-relaxed text-text-muted">{selected.description}</p>
              {selected.decision_note && (
                <div className="mt-5 rounded-xl bg-surface-muted p-4">
                  <p className="text-small font-semibold text-text">Respuesta enviada</p>
                  <p className="mt-2 whitespace-pre-wrap text-small text-text-muted">{selected.decision_note}</p>
                </div>
              )}
              {selected.status === 'pendiente' && (
                <>
                  <Textarea
                    id="appeal-decision-note"
                    label="Respuesta para la persona *"
                    rows={4}
                    minLength={10}
                    maxLength={2000}
                    value={decisionNote}
                    onChange={(event) => setDecisionNote(event.target.value)}
                    className="mt-6"
                    hint="La respuesta quedará registrada y será visible para la persona."
                  />
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button type="button" icon={Check} disabled={saving} onClick={() => decide('aceptada')}>
                      Aceptar y reactivar
                    </Button>
                    <Button type="button" variant="danger" icon={X} disabled={saving} onClick={() => decide('rechazada')}>
                      Rechazar solicitud
                    </Button>
                  </div>
                </>
              )}
              {selected.reviewed_at && (
                <p className="mt-5 inline-flex items-center gap-2 text-caption text-text-muted">
                  <Scale size={14} aria-hidden="true" />
                  Resuelta por {selected.reviewer?.full_name || 'administración'} · {new Date(selected.reviewed_at).toLocaleString('es-CO')}
                </p>
              )}
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
