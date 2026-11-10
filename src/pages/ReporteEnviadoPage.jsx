import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import InfoBox from '../components/InfoBox';
import TileEquipo from '../components/TileEquipo';
import { useAuth } from '../context/AuthContext';
import { loadClientReport } from '../services/clientService';

const REASONS = {
  engañosa: 'Información engañosa',
  fotos: 'Fotos que no pertenecen al vehículo',
  duplicada: 'Publicación duplicada',
  inapropiado: 'Contenido inapropiado',
  datos_personales: 'Incluye datos personales',
  otro: 'Otro motivo',
};
const STATUSES = { pendiente: 'Pendiente', revision: 'En revisión', resuelto: 'Resuelto' };

export default function ReporteEnviadoPage() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reporteId');
  const isReviewReport = searchParams.get('tipo') === 'valoracion';
  const isLandlord = searchParams.get('rol') === 'arrendador';
  const reviewsPath = isLandlord ? '/arrendador/valoraciones' : '/cliente/valoraciones';
  const { session } = useAuth();
  const [report, setReport] = useState(null);
  const [loadedReportId, setLoadedReportId] = useState('');
  const [reportError, setReportError] = useState(null);
  const loading = Boolean(reportId && session?.user?.id && loadedReportId !== reportId);
  useEffect(() => {
    let active = true;
    if (!reportId || !session?.user?.id) return () => { active = false; };
    loadClientReport(reportId, session.user.id)
      .then((loadedReport) => {
        if (!active) return;
        if (!loadedReport) {
          setReportError({ id: reportId, message: 'No se encontró el reporte asociado a esta cuenta.' });
          return;
        }
        setReport(loadedReport);
      })
      .catch((loadError) => {
        if (active) setReportError({ id: reportId, message: loadError.message });
      })
      .finally(() => {
        if (active) setLoadedReportId(reportId);
      });
    return () => { active = false; };
  }, [reportId, session?.user?.id]);
  const currentReport = report?.id === reportId ? report : null;
  const displayError = reportError?.id === reportId
    ? reportError.message
    : !reportId || !session?.user?.id
      ? 'No se pudo identificar el reporte o la sesión.'
      : '';
  const equipmentId = currentReport?.equipment?.id;
  const equipmentQuery = equipmentId ? `?id=${encodeURIComponent(equipmentId)}` : '';
  const targetName = isReviewReport
    ? 'Valoración reportada'
    : currentReport?.equipment?.name || 'Publicación reportada';
  const targetDetail = currentReport?.equipment?.municipality || '';
  return (
    <PaginaCuenta rol="cliente" ancho="estrecho">
      <PageHeader
        volver={{ to: isReviewReport ? reviewsPath : '/catalogo', texto: isReviewReport ? 'Volver a mis valoraciones' : 'Volver a explorar' }}
        eyebrow={isReviewReport ? 'Reporte de valoración' : 'Reporte de publicación'}
        titulo="Gracias por estar pendiente."
        subtitulo="Tu aporte ayuda a cuidar Rentia."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
        <section aria-label="Reporte enviado" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success md:size-16">
            <span className="flex size-6 items-center justify-center rounded-full border border-current">
              <Check size={14} aria-hidden="true" />
            </span>
          </span>
          <h2 className="mt-5 text-heading-md font-semibold text-text md:mt-6">Reporte enviado</h2>
          {currentReport && <Badge tone={currentReport.status === 'resuelto' ? 'success' : 'warning'} className="mt-4">{STATUSES[currentReport.status] || currentReport.status}</Badge>}

          {!isReviewReport && <TileEquipo nombre={targetName} detalle={targetDetail} className="mt-5" />}

          {currentReport && <p className="mt-6 text-body font-semibold text-text-muted">{REASONS[currentReport.reason] || currentReport.reason}</p>}
          {currentReport?.description && <p className="mt-3 text-body text-text-muted">{currentReport.description}</p>}
          {isReviewReport && currentReport?.review && (
            <div className="mt-5 rounded-xl bg-surface-muted p-4">
              <p className="font-semibold text-text">Valoración · {currentReport.review.rating}/5</p>
              <p className="mt-2 text-small text-text-muted">{currentReport.review.comment}</p>
            </div>
          )}
          {displayError && <p role="alert" className="mt-4 text-small text-danger">{displayError}</p>}
          {loading && <p role="status" className="mt-6 text-body text-text-muted">Cargando el estado del reporte…</p>}
          <p className="mt-4 text-body text-text-muted">
            {currentReport ? `Enviado el ${new Date(currentReport.created_at).toLocaleString('es-CO')}.` : 'El reporte y su estado se consultan de forma privada desde esta cuenta.'}
          </p>
          {currentReport && (
            <button type="button" onClick={() => window.location.reload()} className="mt-3 min-h-11 text-small font-semibold text-primary">
              Actualizar estado
            </button>
          )}

          <InfoBox title="Tratamiento privado" className="mt-5">
            Tu identidad y explicación no se muestran en la publicación. El reporte no supone una sanción automática.
          </InfoBox>

          <div className="mt-5 flex flex-col gap-3">
            <Button as={Link} to={isReviewReport ? reviewsPath : '/catalogo'} size="lg" fullWidth>{isReviewReport ? 'Volver a mis valoraciones' : 'Volver al catálogo'}</Button>
            {!isReviewReport && equipmentId && <Button as={Link} to={`/detalle-equipo${equipmentQuery}`} variant="secondary" size="lg" fullWidth>Volver a la publicación</Button>}
          </div>
        </section>

        <aside className="hidden rounded-2xl bg-surface-muted p-6 lg:block">
          <h2 className="text-heading-md font-semibold text-text">¿Qué pasa ahora?</h2>
          <p className="mt-5 text-body text-text-muted">
            Administración revisa el contenido y el motivo antes de tomar medidas. {isReviewReport ? 'La valoración puede mantenerse visible durante la revisión.' : 'La publicación puede mantenerse visible durante la revisión.'}
          </p>
          <p className="mt-5 text-body text-text-muted">
            No es una conversación con el propietario ni un canal de negociación.
          </p>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
