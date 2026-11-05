import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import StarRating from '../components/StarRating';
import ReviewHighlights from '../components/ReviewHighlights';
import { useAuth } from '../context/AuthContext';
import { loadClientReviewSummary } from '../services/clientService';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function ReviewCard({ review, edit }) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-heading-sm font-semibold text-text">{review.target?.full_name || review.author?.full_name || 'Usuario de Rentia'}</h2>
          <p className="mt-1 text-small text-text-muted">{review.equipment?.name || 'Equipo relacionado'}</p>
        </div>
        <StarRating size={16} value={review.rating} className="shrink-0" />
      </div>
      <ReviewHighlights items={review.highlighted_aspects} />
      <p className="mt-4 whitespace-pre-wrap text-body text-text-muted">{review.comment || 'Sin comentario.'}</p>
      {edit && (
        <Link
          to={`/valoraciones/cliente-a-arrendador?targetUserId=${review.target?.id}&equipmentId=${review.equipment?.id}&reviewType=${review.review_type || 'arrendador'}&edit=1`}
          className="mt-4 inline-flex min-h-11 items-center text-label font-semibold text-text"
        >
          Editar valoración
        </Link>
      )}
      {!edit && (
        <Link
          to={`/reportar-valoracion?reviewId=${review.id}`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-label font-semibold text-danger"
        >
          Reportar valoración
        </Link>
      )}
    </Card>
  );
}

export default function ClienteValoracionesPage() {
  const { session } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientReviewSummary(session.user.id)
      .then((summary) => {
        setReviews(summary.sent);
        setReceivedReviews(summary.received);
      })
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const personReviews = useMemo(() => reviews.filter((review) => (review.review_type || 'arrendador') === 'arrendador'), [reviews]);
  const equipmentReviews = useMemo(() => reviews.filter((review) => review.review_type === 'equipo'), [reviews]);

  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: '/cliente', texto: 'Volver a mi espacio' }}
        eyebrow="Mi cuenta / Valoraciones"
        titulo="Tu voz hace comunidad."
        subtitulo="Consulta lo que has compartido, lo que han compartido contigo y las experiencias asociadas a cada equipo."
      />
      {error && <p role="alert" className="mt-6 text-small text-danger">{error}</p>}

      <div className="mt-8 grid gap-10 xl:grid-cols-2">
        <section aria-labelledby="enviadas">
          <h2 id="enviadas" className="text-heading-md font-semibold text-text">Mis valoraciones</h2>
          <p className="mt-1 text-small text-text-muted">Valoraciones que has publicado sobre arrendadores.</p>
          <div className="mt-4 space-y-4">
            {personReviews.length ? personReviews.map((review) => <ReviewCard key={review.id} review={review} edit />) : (
              <InfoBox title="Aún no tienes valoraciones publicadas">Cuando valores una experiencia real, aparecerá aquí.</InfoBox>
            )}
          </div>
        </section>

        <section aria-labelledby="recibidas">
          <h2 id="recibidas" className="text-heading-md font-semibold text-text">Valoraciones recibidas</h2>
          <p className="mt-1 text-small text-text-muted">Lo que los arrendadores han compartido sobre ti.</p>
          <div className="mt-4 space-y-4">
            {receivedReviews.length ? receivedReviews.map((review) => <ReviewCard key={review.id} review={review} />) : (
              <InfoBox title="Aún no tienes valoraciones recibidas">Cuando alguien valore una experiencia contigo, aparecerá aquí.</InfoBox>
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="equipos" className="mt-10">
        <h2 id="equipos" className="text-heading-md font-semibold text-text">Valoraciones por equipo</h2>
        <p className="mt-1 text-small text-text-muted">Consulta las puntuaciones, aspectos destacados y comentarios asociados a cada equipo.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {equipmentReviews.length ? equipmentReviews.map((review) => <ReviewCard key={review.id} review={review} edit />) : (
            <InfoBox title="Aún no hay valoraciones de equipos">Las valoraciones aparecerán aquí cuando se publique la primera.</InfoBox>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
