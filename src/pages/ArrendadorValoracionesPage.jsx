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

function ReviewCard({ review, received = false, showEquipmentLink = false }) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-heading-sm font-semibold text-text">{review.author?.full_name || review.target?.full_name || 'Usuario de Rentia'}</h2>
          <p className="mt-1 text-small text-text-muted">{review.equipment?.name || 'Equipo relacionado'}</p>
        </div>
        <StarRating size={16} value={review.rating} className="shrink-0" />
      </div>
      <ReviewHighlights items={review.highlighted_aspects} />
      <p className="mt-4 whitespace-pre-wrap text-body text-text-muted">{review.comment || 'Sin comentario.'}</p>
      {!received && (
        <Link
          to={`/valoraciones/arrendador-a-cliente?targetUserId=${review.target?.id}&equipmentId=${review.equipment?.id}&reviewType=${review.review_type || 'arrendador'}&edit=1`}
          className="mt-4 inline-flex min-h-11 items-center text-label font-semibold text-text"
        >
          Editar valoración
        </Link>
      )}
      {received && (
        <Link
          to={`/reportar-valoracion?reviewId=${review.id}`}
          className="mt-4 inline-flex min-h-11 items-center text-label font-semibold text-danger"
        >
          Reportar valoración
        </Link>
      )}
      {showEquipmentLink && review.equipment?.id && (
        <Link
          to={`/detalle-equipo?id=${encodeURIComponent(review.equipment.id)}`}
          className="mt-4 inline-flex min-h-11 items-center text-label font-semibold text-primary"
        >
          Ver equipo valorado →
        </Link>
      )}
    </Card>
  );
}

export default function ArrendadorValoracionesPage() {
  const { session } = useAuth();
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [sentReviews, setSentReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientReviewSummary(session.user.id)
      .then((summary) => {
        setReceivedReviews(summary.received);
        setSentReviews(summary.sent);
      })
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const equipmentReviews = useMemo(() => receivedReviews.filter((review) => review.review_type === 'equipo'), [receivedReviews]);
  const personReviews = useMemo(() => receivedReviews.filter((review) => (review.review_type || 'arrendador') === 'arrendador'), [receivedReviews]);
  const average = receivedReviews.length
    ? receivedReviews.reduce((total, review) => total + review.rating, 0) / receivedReviews.length
    : null;

  return (
    <DashboardLayout rol="arrendador" activo="valoraciones">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Mi negocio / Valoraciones"
        titulo="La confianza se construye con experiencias reales."
        subtitulo="Consulta las opiniones sobre tus equipos y las valoraciones que has compartido con clientes."
      />
      {error && <p role="alert" className="mt-6 text-small text-danger">{error}</p>}
      {average !== null && (
        <Card className="mt-6 flex flex-wrap items-center gap-4 lg:mt-8">
          <div>
            <p className="text-title-desktop font-semibold text-primary">{average.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
            <p className="text-small text-text-muted">{receivedReviews.length} valoración{receivedReviews.length === 1 ? '' : 'es'} recibida{receivedReviews.length === 1 ? '' : 's'}</p>
          </div>
          <StarRating size={20} value={average} />
        </Card>
      )}

      <div className="mt-8 grid gap-10 xl:grid-cols-2">
        <section aria-labelledby="recibidas-arrendador">
          <h2 id="recibidas-arrendador" className="text-heading-md font-semibold text-text">Valoraciones recibidas</h2>
          <p className="mt-1 text-small text-text-muted">Lo que los clientes han compartido sobre ti y tus equipos.</p>
          <div className="mt-4 space-y-4">
            {personReviews.length ? personReviews.map((review) => <ReviewCard key={review.id} review={review} received />) : (
              <InfoBox title="Aún no tienes valoraciones recibidas">Cuando un cliente valore una experiencia real contigo, aparecerá aquí.</InfoBox>
            )}
          </div>
        </section>

        <section aria-labelledby="enviadas-arrendador">
          <h2 id="enviadas-arrendador" className="text-heading-md font-semibold text-text">Mis valoraciones</h2>
          <p className="mt-1 text-small text-text-muted">Valoraciones que has publicado sobre clientes.</p>
          <div className="mt-4 space-y-4">
            {sentReviews.length ? sentReviews.map((review) => <ReviewCard key={review.id} review={review} />) : (
              <InfoBox title="Aún no has publicado valoraciones">Podrás valorar a un cliente después de una experiencia real.</InfoBox>
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="equipos-arrendador" className="mt-10">
        <h2 id="equipos-arrendador" className="text-heading-md font-semibold text-text">Valoraciones por equipo</h2>
        <p className="mt-1 text-small text-text-muted">Todas las valoraciones vinculadas a tus equipos publicados.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {equipmentReviews.length ? equipmentReviews.map((review) => <ReviewCard key={review.id} review={review} received showEquipmentLink />) : (
            <InfoBox title="Aún no hay valoraciones de equipos">Aparecerán aquí cuando alguien valore una experiencia relacionada con un equipo.</InfoBox>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
