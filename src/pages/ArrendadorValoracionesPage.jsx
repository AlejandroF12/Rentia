import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { loadClientReviewSummary } from '../services/clientService';
import { useEffect, useState } from 'react';

export default function ArrendadorValoracionesPage() {
  const { session } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientReviewSummary(session.user.id)
      .then((summary) => setReviews(summary.received))
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : null;

  return (
    <DashboardLayout rol="arrendador" activo="valoraciones">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Mi negocio / Valoraciones"
        titulo="La confianza se construye con experiencias reales."
        subtitulo="Consulta las opiniones que la comunidad ha dejado sobre tus equipos y tu atención."
      />
      {error && <p role="alert" className="mt-6 text-small text-danger">{error}</p>}
      {average !== null && (
        <Card className="mt-6 flex items-center gap-4 lg:mt-8">
          <div>
            <p className="text-title-desktop font-semibold text-primary">
              {average.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </p>
            <p className="text-small text-text-muted">{reviews.length} valoración{reviews.length === 1 ? '' : 'es'} recibida{reviews.length === 1 ? '' : 's'}</p>
          </div>
          <StarRating size={20} value={average} />
        </Card>
      )}
      {!error && reviews.length === 0 && (
        <InfoBox title="Aún no tienes valoraciones recibidas" className="mt-6 lg:mt-8">
          Cuando un cliente valore una experiencia real contigo, aparecerá aquí.
        </InfoBox>
      )}
      <div className="mt-6 space-y-4 lg:mt-8">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-heading-sm font-semibold text-text">{review.author?.full_name || 'Cliente de Rentia'}</h2>
                <p className="mt-1 text-small text-text-muted">{review.equipment?.name || 'Equipo relacionado'}</p>
              </div>
              <StarRating size={16} value={review.rating} />
            </div>
            <p className="mt-4 text-body text-text-muted">{review.comment}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
