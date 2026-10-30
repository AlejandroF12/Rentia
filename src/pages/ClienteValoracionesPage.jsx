import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { loadClientReviews } from '../services/clientService';
import { useEffect, useState } from 'react';

export default function ClienteValoracionesPage() {
  const { session } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientReviews(session.user.id).then(setReviews).catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: '/cliente', texto: 'Volver a mi espacio' }}
        eyebrow="Mi cuenta / Valoraciones"
        titulo="Tu voz hace comunidad."
        subtitulo="Aquí aparecerán las valoraciones que publiques desde tus experiencias reales."
      />
      {error && <p role="alert" className="mt-6 text-small text-danger">{error}</p>}
      {!error && reviews.length === 0 && (
        <InfoBox title="Aún no tienes valoraciones publicadas" className="mt-6 lg:mt-8">
          Cuando valores a un arrendador después de contactarlo, tu opinión aparecerá aquí.
        </InfoBox>
      )}
      <div className="mt-6 space-y-4 lg:mt-8">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-heading-sm font-semibold text-text">{review.target?.full_name || 'Usuario de Rentia'}</h2>
                <p className="mt-1 text-small text-text-muted">{review.equipment?.name || 'Equipo relacionado'}</p>
              </div>
              <StarRating size={16} />
            </div>
            <p className="mt-4 text-body text-text-muted">{review.comment}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
