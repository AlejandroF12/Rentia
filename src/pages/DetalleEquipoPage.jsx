import { MapPin, Heart, Share2, Images, MessageCircle, Phone, ArrowUpRight, Flag } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { EstadoBadge } from '../components/Badge';
import StarRating from '../components/StarRating';
import InfoBox from '../components/InfoBox';
import MapaEstatico from '../components/MapaEstatico';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadEquipmentById, loadEquipmentImages, loadEquipmentOwner } from '../services/equipmentService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadFavoriteEquipmentIds, setFavorite } from '../services/clientService';
import ReviewHighlights from '../components/ReviewHighlights';
import Skeleton from '../components/Skeleton';

function TarjetaPropietario({ owner, equipmentId }) {
  const { profile, session } = useAuth();
  const phone = owner?.phone || '';
  const phoneDigits = phone.replace(/\D/g, '');
  const ownerName = owner?.full_name || 'Propietario de Rentia';
  const loginHref = '/ingresar';
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-caption font-medium uppercase tracking-wide text-text-muted">Habla con el propietario</p>

      <div className="mt-4 flex items-center gap-3">
        <Avatar className="size-12" />
        <div>
          <p className="text-body-lg font-semibold text-text">{ownerName}</p>
          <p className="text-small text-text-muted">Arrendador · {owner?.municipality || 'Casanare'}</p>
        </div>
      </div>

      <p className="mt-4 text-small text-text-muted">En Rentia desde marzo de 2024</p>

      <div className="mt-4 space-y-3">
        <Button as="a" href={session ? (phoneDigits ? `https://wa.me/${phoneDigits}` : '#') : loginHref} target={session ? '_blank' : undefined} rel={session ? 'noreferrer' : undefined} size="lg" fullWidth icon={MessageCircle} trailingIcon={ArrowUpRight} disabled={Boolean(session && !phoneDigits)}>
          {session ? 'Contactar por WhatsApp' : 'Inicia sesión para contactar'}
        </Button>
        <Button as="a" href={session ? (phone ? `tel:${phone}` : '#') : loginHref} variant="secondary" size="lg" fullWidth icon={Phone} trailingIcon={ArrowUpRight} disabled={Boolean(session && !phone)}>
          {session ? `Llamar a ${ownerName}` : 'Inicia sesión para llamar'}
        </Button>
      </div>

      <p className="mt-4 text-center text-small text-text-muted">{phone || 'Teléfono no autorizado'}</p>

      <InfoBox icon={ArrowUpRight} className="mt-4">
        El contacto y la negociación son directos con el propietario, fuera de Rentia.
      </InfoBox>

          <a href={owner?.id ? `/perfil-publico?ownerId=${owner.id}` : '#'} className="mt-4 inline-block text-small font-semibold text-text">Ver perfil y valoraciones →</a>
          {profile?.role === 'cliente' && owner?.id && (
            <Link
              to={`/valoraciones/cliente-a-arrendador?targetUserId=${encodeURIComponent(owner.id)}&equipmentId=${encodeURIComponent(equipmentId)}&reviewType=equipo`}
              className="mt-4 flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-center text-label font-semibold text-primary-foreground"
            >
              Valorar este equipo
            </Link>
          )}
          {profile?.role === 'cliente' && owner?.id && (
            <Link
              to={`/valoraciones/politica?targetUserId=${encodeURIComponent(owner.id)}&equipmentId=${encodeURIComponent(equipmentId)}&reviewType=arrendador`}
              className="mt-3 inline-block text-small font-semibold text-text"
            >
              Valorar al arrendador →
            </Link>
          )}

      <p className="mt-4 flex items-center gap-1.5 text-caption text-text-muted">
        <Link to={`/reportar-publicacion?id=${encodeURIComponent(equipmentId)}`} className="inline-flex items-center gap-1.5">
          <Flag size={10} aria-hidden="true" /> Reportar esta publicación
        </Link>
      </p>
    </div>
  );
}

export default function DetalleEquipoPage() {
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('id');
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const hasInvalidEquipmentId = Boolean(equipmentId && !uuidPattern.test(equipmentId));
  const [equipment, setEquipment] = useState(null);
  const [images, setImages] = useState([]);
  const [favorite, setFavoriteState] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { session, profile } = useAuth();
  const [error, setError] = useState(() => (
    !equipmentId
      ? 'No se indicó el equipo que deseas consultar.'
      : hasInvalidEquipmentId
        ? 'El enlace del equipo no es válido. Regresa al catálogo y selecciona una publicación.'
        : ''
  ));

  useEffect(() => {
    if (!equipmentId || hasInvalidEquipmentId) {
      return;
    }

    Promise.all([loadEquipmentById(equipmentId), loadEquipmentImages(equipmentId)])
      .then(async ([item, equipmentImages]) => {
        const owner = session?.user?.id ? await loadEquipmentOwner(item.owner_id) : null;
        setEquipment({ ...item, owner });
        setImages(equipmentImages);
      })
      .catch((loadError) => setError(loadError.message));
    if (session?.user?.id && profile?.role === 'cliente') {
      loadFavoriteEquipmentIds(session.user.id)
        .then((ids) => setFavoriteState(ids.includes(equipmentId)))
        .catch((loadError) => setFavoriteError(loadError.message));
    }
  }, [equipmentId, hasInvalidEquipmentId, session?.user?.id, profile?.role]);

  if (!equipmentId) {
    return <main className="mx-auto max-w-[1440px] px-5 py-16 text-danger">No se indicó el equipo que deseas consultar.</main>;
  }
  if (error) {
    return <main className="mx-auto max-w-[1440px] px-5 py-16 text-danger">{error}</main>;
  }
  if (!equipment) {
    return (
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="mt-8 h-10 w-2/3 max-w-xl" />
        <Skeleton className="mt-3 h-5 w-48" />
        <div className="mt-6 grid grid-cols-2 gap-3 lg:h-[360px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
          <Skeleton className="col-span-2 aspect-[4/3] w-full lg:col-span-2 lg:row-span-2 lg:aspect-auto" />
          <Skeleton className="h-28 w-full lg:h-full" />
          <Skeleton className="h-28 w-full lg:h-full" />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  const owner = equipment.owner;
  const reviews = (equipment.reviews ?? []).filter((review) => review.is_published && review.review_type === 'equipo');
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : null;
  const fichaReal = [
    ['Marca', equipment.brand || 'No especificada'],
    ['Modelo', equipment.model || equipment.model_year || 'No especificado'],
    ['Característica', equipment.main_feature || 'Consultar con el propietario'],
  ];

  return (
    <div className="min-h-screen bg-surface font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        {/* Migas + acciones */}
        <div className="flex items-center justify-between">
          <Breadcrumb items={[
            { label: 'Inicio', to: '/' },
            { label: 'Explorar equipos', to: '/catalogo' },
            { label: equipment.name },
          ]} />
          <div className="flex items-center gap-4 text-text">
            {profile?.role === 'cliente' && <button
              type="button"
              aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              disabled={!session?.user?.id}
              onClick={async () => {
                try {
                  setFavoriteError('');
                  await setFavorite(session.user.id, equipmentId, !favorite);
                  setFavoriteState((current) => !current);
                } catch (favoriteLoadError) {
                  setFavoriteError(favoriteLoadError.message);
                }
              }}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
            </button>}
            <button
              type="button"
              aria-label="Compartir"
              onClick={async () => {
                const url = window.location.href;
                if (navigator.share) {
                  await navigator.share({ title: equipment.name, url });
                } else {
                  await navigator.clipboard.writeText(url);
                }
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Encabezado */}
        <div className="mt-5 flex items-center gap-3">
          <p className="text-caption font-medium uppercase tracking-wide text-text-muted">{equipment.category}</p>
          <EstadoBadge disponible={equipment.is_available} />
        </div>
        <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">{equipment.name}</h1>
        <div className="mt-3 flex flex-col gap-1 text-label text-text-muted md:flex-row md:items-center md:gap-6">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> {equipment.municipality}</span>
        </div>

        {/* Galería */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:h-[360px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
          {images[0] ? <img src={images[0].url} alt={equipment.name} className="col-span-2 aspect-[4/3] w-full rounded-2xl object-cover lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full" /> : <ImagenNoEncontrada className="col-span-2 aspect-[4/3] w-full rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full" />}
          {images[1] ? <img src={images[1].url} alt="" className="h-28 w-full rounded-2xl object-cover lg:h-full" /> : <ImagenNoEncontrada className="h-28 w-full rounded-2xl lg:h-full" />}
          <div className="relative h-28 lg:h-full">
            {images[2] ? <img src={images[2].url} alt="" className="size-full rounded-2xl object-cover" /> : <ImagenNoEncontrada className="size-full rounded-2xl" />}
            <button type="button" onClick={() => setGalleryOpen(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-small font-semibold text-text">
              <Images size={14} aria-hidden="true" />
              <span className="lg:hidden">Ver {images.length} fotos</span>
              <span className="hidden lg:inline">Ver las {images.length} fotos</span>
            </button>
          </div>
        </div>

        {/* Contenido + propietario */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          <aside className="lg:col-start-2 lg:row-start-1">
            <TarjetaPropietario owner={owner} equipmentId={equipment.id} />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">{equipment.name}</h2>
                {favoriteError && <p role="alert" className="mt-3 text-small text-danger">{favoriteError}</p>}
                <p className="mt-3 text-body-lg text-text-muted">{equipment.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {fichaReal.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="rounded-lg bg-background p-4">
                  <dt className="text-small text-text-muted">{etiqueta}</dt>
                  <dd className="mt-1 text-label font-semibold text-text">{valor}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 text-heading-md font-semibold text-text">Cerca de ti</h2>
            <p className="mt-1 text-small text-text-muted">
              {equipment.sector ? `${equipment.sector} · ` : ''}{equipment.municipality || 'Ubicación no disponible'}
            </p>
            {equipment.municipality ? (
              <MapaEstatico municipio={equipment.municipality} sector={equipment.sector || 'Ubicación aproximada'} className="mt-4 h-48" />
            ) : (
              <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted text-small text-text-muted">
                La ubicación aproximada aún no está disponible.
              </div>
            )}
            <p className="mt-3 text-caption text-text-muted">
              La ubicación es aproximada y solo sirve para encontrar equipos cercanos. Confirma el punto exacto con el propietario.
            </p>

            <hr className="my-8 border-border" />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-heading-md font-semibold text-text">Valoraciones</h2>
              {averageRating !== null && <div className="flex items-center gap-2"><StarRating size={18} value={averageRating} /><span className="text-small text-text-muted">{averageRating.toFixed(1)} · {reviews.length} valoración{reviews.length === 1 ? '' : 'es'}</span></div>}
            </div>
            {reviews.length ? (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-border bg-surface-muted p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <StarRating size={16} value={review.rating} />
                      <span className="text-small text-text-muted">Experiencia verificada por Rentia</span>
                    </div>
                    <ReviewHighlights items={review.highlighted_aspects} />
                    <p className="mt-3 whitespace-pre-wrap text-body text-text-muted">{review.comment || 'Sin comentario.'}</p>
                  </article>
                ))}
              </div>
            ) : (
              <InfoBox className="mt-5">Este equipo todavía no tiene valoraciones publicadas.</InfoBox>
            )}

            <p className="mt-6 flex items-center gap-1.5 text-caption text-text-muted lg:hidden">
              <Flag size={10} aria-hidden="true" /> Reportar esta publicación
            </p>
          </div>
        </div>
      </main>
      {galleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/80 p-5" role="dialog" aria-modal="true" aria-label="Galería de imágenes">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-surface p-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-heading-md font-semibold text-text">Fotos de {equipment.name}</h2>
              <button type="button" onClick={() => setGalleryOpen(false)} className="text-label font-semibold text-text">Cerrar</button>
            </div>
            {images.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {images.map((image, index) => <img key={image.id} src={image.url} alt={`${equipment.name}, foto ${index + 1}`} className="w-full rounded-xl object-cover" />)}
              </div>
            ) : <p className="mt-4 text-small text-text-muted">Este equipo aún no tiene imágenes.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
