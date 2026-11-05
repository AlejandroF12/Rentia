import { Flag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';
import OpcionSeleccionable from '../components/OpcionSeleccionable';
import Textarea from '../components/Textarea';
import { useAuth } from '../context/AuthContext';
import { createReport } from '../services/clientService';

const MOTIVOS = [
  { id: 'engañosa', titulo: 'Información engañosa' },
  { id: 'inapropiado', titulo: 'Contenido inapropiado' },
  { id: 'datos_personales', titulo: 'Incluye datos personales' },
  { id: 'otro', titulo: 'Otro' },
];

export default function ReportarValoracionPage() {
  const { session, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const [reason, setReason] = useState('inapropiado');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!session?.user?.id || !reviewId) {
      setError('No se pudo identificar la valoración o tu sesión.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createReport({ reporterId: session.user.id, reviewId, reason, description });
      window.location.assign(`/reporte-enviado?tipo=valoracion&rol=${profile?.role || 'cliente'}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PaginaCuenta rol={profile?.role || 'cliente'} ancho="estrecho">
      <PageHeader
        volver={{ to: '/cliente/valoraciones', texto: 'Volver a mis valoraciones' }}
        eyebrow="Reporte de valoración"
        titulo="Ayúdanos a cuidar la comunidad."
        subtitulo="El reporte será revisado de forma privada por administración."
      />
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-2xl border border-border bg-surface p-5 md:p-6">
        <fieldset>
          <legend className="text-heading-lg font-semibold text-text">¿Cuál es el motivo?</legend>
          <div className="mt-5 space-y-3">
            {MOTIVOS.map(({ id, titulo }) => (
              <OpcionSeleccionable key={id} id={`motivo-${id}`} name="motivo" titulo={titulo} defaultChecked={id === reason} onChange={() => setReason(id)} className="items-center py-3.5" />
            ))}
          </div>
        </fieldset>
        <Textarea id="explicacion" label="Explicación (opcional)" rows={4} maxLength={500} className="mt-6" value={description} onChange={(event) => setDescription(event.target.value)} />
        <InfoBox title="Tu reporte es privado" className="mt-5">No se publica tu identidad ni se informa al autor quién reportó.</InfoBox>
        <div className="mt-5 flex flex-col gap-3">
          {error && <p role="alert" className="text-small text-danger">{error}</p>}
          <Button type="submit" size="lg" fullWidth icon={Flag} disabled={submitting || !reviewId}>{submitting ? 'Enviando...' : 'Enviar reporte'}</Button>
          <Button as={Link} to={profile?.role === 'arrendador' ? '/arrendador/valoraciones' : '/cliente/valoraciones'} variant="secondary" size="lg" fullWidth>Cancelar</Button>
        </div>
      </form>
    </PaginaCuenta>
  );
}
