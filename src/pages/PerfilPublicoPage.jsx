import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Eyebrow from '../components/Eyebrow';
import InfoBox from '../components/InfoBox';
import EquipoCard from '../components/EquipoCard';
import StarRating from '../components/StarRating';
import { loadPublicProfile } from '../services/clientService';
import ReviewHighlights from '../components/ReviewHighlights';

export default function PerfilPublicoPage() {
  const [searchParams] = useSearchParams();
  const ownerId = searchParams.get('ownerId');
  const [data, setData] = useState(null);
  const [error, setError] = useState(() => ownerId ? '' : 'No se indicó el propietario que deseas consultar.');

  useEffect(() => {
    if (!ownerId) return;
    loadPublicProfile(ownerId).then(setData).catch((loadError) => setError(loadError.message));
  }, [ownerId]);

  if (error) return <main className="mx-auto max-w-[1440px] px-5 py-16 text-danger">{error}</main>;
  if (!data) return <main className="mx-auto max-w-[1440px] px-5 py-16 text-text-muted">Cargando perfil...</main>;

  const { profile, equipment, reviews: allReviews } = data;
  const reviews = allReviews.filter((review) => !review.review_type || review.review_type === 'arrendador');
  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : null;
  const phone = profile.phone || '';
  const phoneDigits = phone.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        <Link to="/catalogo" className="text-small text-text-muted">← Volver al catálogo</Link>

        <Eyebrow className="mt-5">Perfil público / Arrendador</Eyebrow>
        <h1 className="mt-2 max-w-[18ch] text-title-mobile font-semibold text-text md:max-w-none md:text-title-desktop">
          Gente de aquí. Confianza que cuenta.
        </h1>
        <p className="mt-2 text-body-lg text-text-muted">Conoce al propietario y las experiencias de la comunidad.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Tarjeta del arrendador */}
          <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-14" />
              <div>
                <p className="text-body-lg font-semibold text-text">{profile.full_name}</p>
                <p className="text-small text-text-muted">Arrendador · {profile.municipality || 'Casanare'}</p>
              </div>
            </div>

            <p className="mt-5 text-small text-text-muted">
              En Rentia desde {new Date(profile.created_at).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </p>

            {average === null ? (
              <p className="mt-4 text-small text-text-muted">Aún no hay valoraciones publicadas.</p>
            ) : (
              <div className="mt-4">
                <div className="flex items-center gap-2"><StarRating size={16} value={average} /><span className="text-small text-text-muted">{average.toFixed(1)} ({reviews.length})</span></div>
              </div>
            )}

            <div className="mt-5 space-y-3">
              <Button as="a" href={phoneDigits ? `https://wa.me/${phoneDigits}` : '#'} target="_blank" rel="noreferrer" size="lg" fullWidth icon={MessageCircle} trailingIcon={ArrowUpRight} disabled={!phoneDigits}>
                Contactar por WhatsApp
              </Button>
              <Button as="a" href={phone ? `tel:${phone}` : '#'} variant="secondary" size="lg" fullWidth icon={Phone} trailingIcon={ArrowUpRight} disabled={!phone}>
                Llamar a {profile.full_name}
              </Button>
            </div>

            <InfoBox title="Contacto directo" className="mt-4">
              La negociación ocurre fuera de Rentia. La reputación recoge experiencias de contacto, no acredita alquileres realizados.
            </InfoBox>
          </aside>

          <div className="min-w-0">
            {/* Equipos */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Equipos de {profile.full_name}</h2>
              <p className="text-small text-text-muted">{equipment.length} publicaciones</p>
            </div>
            {equipment.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {equipment.map((item) => <EquipoCard key={item.id} equipo={{ ...item, nombre: item.name, categoria: item.category, lugar: item.municipality, distancia: '', puntaje: '—', disponible: item.is_available }} favorito={false} />)}
              </div>
            ) : <InfoBox className="mt-4">Este arrendador aún no tiene publicaciones visibles.</InfoBox>}

            {/* Opiniones */}
            <h2 className="mt-10 text-heading-md font-semibold text-text md:text-heading-lg">Opiniones de la comunidad</h2>
            {reviews.length ? reviews.map((review) => (
              <article key={review.id} className="mt-4 rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between gap-3"><span className="text-label font-semibold text-text">{review.author?.full_name || 'Usuario de Rentia'}</span><StarRating size={14} value={review.rating} /></div>
                <ReviewHighlights items={review.highlighted_aspects} />
                <p className="mt-3 text-small text-text-muted">{review.comment || 'Sin comentario.'}</p>
              </article>
            )) : <InfoBox className="mt-4">Aún no hay opiniones publicadas para este perfil.</InfoBox>}
          </div>
        </div>
      </main>
    </div>
  );
}
