import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeAlert, Clock3, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import Textarea from '../components/Textarea';
import { loadMyAccountAppeals, submitAccountAppeal } from '../services/appealService';

const appealStatus = {
  pendiente: { label: 'Pendiente de revisión', tone: 'warning' },
  aceptada: { label: 'Aceptada', tone: 'success' },
  rechazada: { label: 'No aprobada', tone: 'danger' },
};

const reasons = [
  { value: 'Suspensión por error', label: 'Creo que la suspensión fue un error' },
  { value: 'Medida desproporcionada', label: 'Considero que la medida fue desproporcionada' },
  { value: 'Información nueva', label: 'Quiero aportar información nueva' },
  { value: 'Otro motivo', label: 'Otro motivo' },
];

export default function CuentaSuspendidaPage() {
  const { profile, session, refreshProfile } = useAuth();
  const [appeals, setAppeals] = useState([]);
  const [reason, setReason] = useState(reasons[0].value);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const activeAppeal = appeals[0]?.status === 'pendiente' ? appeals[0] : null;
  const acceptedAppeal = appeals[0]?.status === 'aceptada' ? appeals[0] : null;

  const loadAppeals = async () => {
    const records = await loadMyAccountAppeals(session.user.id);
    setAppeals(records);
  };

  useEffect(() => {
    let active = true;
    loadMyAccountAppeals(session.user.id)
      .then(async (records) => {
        if (!active) return;
        setAppeals(records);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [session.user.id]);

  const checkAppealStatus = async () => {
    setChecking(true);
    setError('');
    try {
      await loadAppeals();
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setChecking(false);
    }
  };

  const continueAfterApproval = async () => {
    setError('');
    try {
      await refreshProfile();
    } catch (refreshError) {
      setError(refreshError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      await submitAccountAppeal({ appellantId: session.user.id, reason, description });
      setDescription('');
      setNotice('Tu solicitud fue enviada. La cuenta seguirá suspendida mientras administración la revisa.');
      await loadAppeals();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PaginaCuenta rol={null} ancho="estrecho">
      <PageHeader
        breadcrumb="Estado de cuenta / Revisión"
        eyebrow="Estado de cuenta"
        titulo="Tu cuenta está suspendida."
        subtitulo="Puedes consultar el motivo y enviar una solicitud de revisión a administración."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:gap-7">
        <Card aria-label="Motivo de la suspensión">
          <div className="flex items-start gap-3">
            <BadgeAlert size={22} className="mt-1 shrink-0 text-danger" aria-hidden="true" />
            <div>
              <Badge tone="danger">Suspendida</Badge>
              <h2 className="mt-4 text-heading-lg font-semibold text-text">{profile?.full_name || 'Tu cuenta'}</h2>
              <p className="mt-2 text-small text-text-muted">
                {profile?.role === 'arrendador' ? 'Arrendador' : 'Cliente'} · {profile?.municipality || 'Municipio no indicado'}
              </p>
            </div>
          </div>
          <p className="mt-6 text-body leading-relaxed text-text-muted">
            No puedes acceder a las funciones de tu cuenta mientras la suspensión esté activa. Las apelaciones se revisan de manera individual; enviarla no reactiva la cuenta automáticamente.
          </p>
          <div className="mt-5 rounded-xl border border-border bg-surface-muted p-4">
            <p className="text-small font-semibold text-text">Motivo de la suspensión</p>
            <p className="mt-2 whitespace-pre-wrap text-small leading-relaxed text-text-muted">
              {profile?.suspension_reason || 'No se registró un motivo para esta suspensión. Puedes explicarlo en tu solicitud de revisión.'}
            </p>
            {profile?.suspended_at && (
              <p className="mt-2 text-caption text-text-muted">
                Fecha: {new Date(profile.suspended_at).toLocaleString('es-CO')}
              </p>
            )}
          </div>
          <InfoBox title="Tu solicitud es privada" className="mt-5">
            Explica únicamente la situación relacionada con la suspensión. No incluyas contraseñas, documentos de identidad ni datos de otras personas.
          </InfoBox>
        </Card>

        <Card>
          <h2 className="text-heading-md font-semibold text-text">Solicitar revisión</h2>
          {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
          {loading ? (
            <p className="mt-4 text-small text-text-muted" aria-busy="true">Cargando tus solicitudes…</p>
          ) : acceptedAppeal ? (
            <div className="mt-4">
              <Badge tone={appealStatus.aceptada.tone}>{appealStatus.aceptada.label}</Badge>
              <p className="mt-4 text-small text-text-muted">Administración aprobó tu solicitud.</p>
              {acceptedAppeal.decision_note && (
                <p className="mt-3 whitespace-pre-wrap text-small leading-relaxed text-text">{acceptedAppeal.decision_note}</p>
              )}
              <Button type="button" size="lg" fullWidth className="mt-5" onClick={continueAfterApproval}>
                Continuar a mi cuenta
              </Button>
            </div>
          ) : activeAppeal ? (
            <div className="mt-4">
              <Badge tone={appealStatus.pendiente.tone}><Clock3 size={12} className="mr-1" />{appealStatus.pendiente.label}</Badge>
              <p className="mt-4 text-label font-semibold text-text">{activeAppeal.reason}</p>
              <p className="mt-2 whitespace-pre-wrap text-small leading-relaxed text-text-muted">{activeAppeal.description}</p>
              <p className="mt-4 text-caption text-text-muted">
                Enviada el {new Date(activeAppeal.created_at).toLocaleString('es-CO')}
              </p>
              <InfoBox title="Ya recibimos tu solicitud" className="mt-5">
                Puedes seguir usando esta página para consultar su estado. No envíes otra mientras siga pendiente.
              </InfoBox>
              <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4" disabled={checking} onClick={checkAppealStatus}>
                {checking ? 'Consultando…' : 'Actualizar estado'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {appeals[0] && (
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <Badge tone={appealStatus[appeals[0].status]?.tone || 'neutral'}>
                    {appealStatus[appeals[0].status]?.label || appeals[0].status}
                  </Badge>
                  <p className="mt-3 text-small font-semibold text-text">{appeals[0].reason}</p>
                  <p className="mt-1 whitespace-pre-wrap text-small text-text-muted">{appeals[0].description}</p>
                  {appeals[0].decision_note && (
                    <p className="mt-3 border-t border-border pt-3 text-small text-text-muted">
                      Respuesta de administración: {appeals[0].decision_note}
                    </p>
                  )}
                  {appeals[0].status === 'rechazada' && (
                    <p className="mt-3 text-small text-text-muted">Puedes presentar una nueva solicitud si tienes información adicional.</p>
                  )}
                </div>
              )}
              <label htmlFor="appeal-reason" className="block text-label font-semibold text-text">
                Motivo de la solicitud
                <select
                  id="appeal-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 font-normal"
                >
                  {reasons.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <Textarea
                id="appeal-description"
                label="Cuéntanos qué debemos revisar"
                rows={5}
                minLength={30}
                maxLength={2000}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                hint="Escribe entre 30 y 2000 caracteres."
              />
              {notice && <p role="status" className="text-small text-success">{notice}</p>}
              <Button type="submit" size="lg" fullWidth icon={Send} disabled={submitting || loading}>
                {submitting ? 'Enviando solicitud…' : 'Enviar solicitud de revisión'}
              </Button>
            </form>
          )}
          {notice && activeAppeal && <p role="status" className="mt-4 text-small text-success">{notice}</p>}
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button as={Link} to="/normas" variant="secondary" size="lg">Leer normas de comunidad</Button>
        <Button as={Link} to="/ayuda" variant="secondary" size="lg">Centro de ayuda</Button>
      </div>
    </PaginaCuenta>
  );
}
