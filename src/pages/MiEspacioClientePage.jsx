import { Link } from 'react-router-dom';
import { ArrowUpRight, Pencil, Star } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import EquipoCard from '../components/EquipoCard';
import StarRating from '../components/StarRating';
import Tabs from '../components/Tabs';
import { useAuth } from '../context/AuthContext';
import { loadClientFavorites, loadClientReviewSummary } from '../services/clientService';
import { useEffect, useState } from 'react';

function TarjetaPerfil({ className = '' }) {
  const { profile } = useAuth();
  const c = {
    nombre: profile?.full_name || 'Tu perfil',
    detalle: profile?.municipality ? `Cliente · ${profile.municipality}` : 'Cliente',
    correo: profile?.email || 'Correo no disponible',
    desde: profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
      : 'Fecha no disponible',
  };
  const dato = (etiqueta, valor) => (
    <div>
      <p className="text-caption text-text-muted">{etiqueta}</p>
      <p className="mt-1 text-label text-text">{valor}</p>
    </div>
  );
  return (
    <Card className={className}>
      <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-4">
        <Avatar src={profile?.avatar_url} alt={`Foto de ${c.nombre}`} className="size-14 lg:size-16" />
        <div>
          <p className="text-heading-sm font-semibold text-text lg:text-heading-lg">{c.nombre}</p>
          <p className="mt-1 text-small text-text-muted">{c.detalle}</p>
        </div>
      </div>
      <Badge tone="success" className="mt-4">Perfil activo</Badge>
      <div className="mt-4 space-y-4 border-t border-border pt-4">
        {dato('Correo', c.correo)}
        {dato('En la comunidad desde', c.desde)}
      </div>
      <Button as={Link} to="/cliente/perfil" variant="secondary" size="lg" icon={Pencil} fullWidth className="mt-5">
        Editar mi perfil
      </Button>
    </Card>
  );
}

function TarjetaReputacion({ className = '', reviewSummary, loading, hasError }) {
  const r = reviewSummary;
  return (
    <section className={`rounded-2xl bg-primary p-5 text-primary-foreground md:p-6 ${className}`}>
      <p className="text-small text-text-inverse-muted">Tu reputación como cliente</p>
      {loading ? (
        <p role="status" aria-live="polite" className="mt-5 text-label">Cargando tus valoraciones…</p>
      ) : hasError ? (
        <p className="mt-5 text-label">No fue posible cargar tus valoraciones.</p>
      ) : r?.received.length ? (
        <>
          <p className="mt-3 text-title-desktop font-semibold leading-none">
            {r.average.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-body-lg font-normal text-text-inverse-muted">/ 5</span>
          </p>
          <StarRating size={16} value={r.average} className="mt-4 text-primary-foreground" />
          <p className="mt-3 text-small text-text-inverse-muted">{r.received.length} valoraciones recibidas</p>
        </>
      ) : (
        <p className="mt-5 text-label">Aún no tienes valoraciones recibidas.</p>
      )}
    </section>
  );
}

function Estadistica({ valor, etiqueta }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-heading-lg font-semibold text-primary">{valor}</p>
      <p className="mt-1 text-small text-text-muted">{etiqueta}</p>
    </div>
  );
}

export default function MiEspacioClientePage() {
  const { profile, session } = useAuth();
  const userId = session?.user?.id;
  const [reviewLoad, setReviewLoad] = useState({ userId: null, data: null, error: '' });
  const [favoritesLoad, setFavoritesLoad] = useState({ userId: null, data: [], error: '' });
  const [activeReviewTab, setActiveReviewTab] = useState('enviadas');
  useEffect(() => {
    let active = true;
    if (!userId) return;

    loadClientReviewSummary(userId)
      .then((data) => { if (active) setReviewLoad({ userId, data, error: '' }); })
      .catch((error) => { if (active) setReviewLoad({ userId, data: null, error: error.message }); });
    loadClientFavorites(userId)
      .then((data) => { if (active) setFavoritesLoad({ userId, data, error: '' }); })
      .catch((error) => { if (active) setFavoritesLoad({ userId, data: [], error: error.message }); });

    return () => { active = false; };
  }, [userId]);
  const reviewMatchesUser = reviewLoad.userId === userId;
  const favoritesMatchUser = favoritesLoad.userId === userId;
  const reviewSummary = reviewMatchesUser ? reviewLoad.data : null;
  const favorites = favoritesMatchUser ? favoritesLoad.data : [];
  const reviewError = reviewMatchesUser ? reviewLoad.error : '';
  const favoriteError = favoritesMatchUser ? favoritesLoad.error : '';
  const reviewsLoading = Boolean(userId) && !reviewMatchesUser;
  const favoritesLoading = Boolean(userId) && !favoritesMatchUser;
  const favoritos = favorites
    .filter(({ equipment }) => equipment)
    .map(({ equipment }) => ({
      ...equipment,
      nombre: equipment.name,
      categoria: equipment.category,
      lugar: equipment.municipality,
      distancia: 'ubicación aproximada',
      puntaje: equipment.rating == null ? '—' : equipment.rating.toFixed(1),
      disponible: equipment.is_available && equipment.publication_status === 'publicada',
      imagen: equipment.image,
    }));
  const activeReviews = activeReviewTab === 'enviadas' ? reviewSummary?.sent : reviewSummary?.received;
  const v = activeReviews?.[0];
  const reviewName = activeReviewTab === 'enviadas' ? v?.target?.full_name : v?.author?.full_name;
  const reviewProfile = activeReviewTab === 'enviadas' ? v?.target : v?.author;
  const stats = {
    favoritos: favoritesLoading ? '—' : favoritos.length,
    enviadas: reviewsLoading ? '—' : reviewSummary?.sent.length || 0,
    recibidas: reviewsLoading ? '—' : reviewSummary?.received.length || 0,
  };

  return (
    <DashboardLayout rol="cliente" activo="espacio">
      <PageHeader
        eyebrow="Mi cuenta / Cliente"
        titulo={`Hola, ${profile?.full_name?.split(' ')[0] || 'de nuevo'}.`}
        subtitulo="Tu próximo proyecto empieza con un buen equipo."
        accion={
          <Button as={Link} to="/catalogo" size="lg" icon={ArrowUpRight} className="w-full md:w-auto">
            Explorar equipos
          </Button>
        }
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        {/* Móvil: perfil y cifras antes de los equipos */}
        <TarjetaPerfil className="lg:hidden" />
        <div className="grid grid-cols-3 gap-3 lg:hidden">
          <Estadistica valor={stats.favoritos} etiqueta="Favoritos" />
          <Estadistica valor={stats.enviadas} etiqueta="Enviadas" />
          <Estadistica valor={stats.recibidas} etiqueta="Recibidas" />
        </div>

        <div className="min-w-0 space-y-6">
          <section aria-labelledby="titulo-favoritos">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="titulo-favoritos" className="text-heading-md font-semibold text-text lg:text-heading-lg">Equipos que te interesan</h2>
              <span className="text-small text-text-muted">
                {favoritesLoading ? 'Cargando favoritos…' : `${favoritos.length} favoritos`}
              </span>
            </div>
            {favoriteError && <p role="alert" className="mt-4 text-small text-danger">{favoriteError}</p>}
            {favoritesLoading ? (
              <p role="status" aria-live="polite" className="mt-4 text-small text-text-muted">Cargando tus equipos favoritos…</p>
            ) : favoritos.length ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {favoritos.map((equipo) => (
                  <EquipoCard
                    key={equipo.id}
                    equipo={equipo}
                    isFavorite
                    onFavoriteChange={(equipmentId, isFavorite) => {
                      if (!isFavorite) {
                        setFavoritesLoad((current) => current.userId === userId
                          ? { ...current, data: current.data.filter((favorite) => favorite.equipment_id !== equipmentId) }
                          : current);
                      }
                    }}
                  />
                ))}
              </div>
            ) : !favoriteError ? (
              <Card className="mt-4 p-6 text-center">
                <p className="text-label font-semibold text-text">Aún no tienes equipos favoritos.</p>
                <p className="mt-2 text-small text-text-muted">Guarda equipos del catálogo para encontrarlos aquí.</p>
                <Button as={Link} to="/catalogo" variant="secondary" size="lg" className="mt-4 w-full md:w-auto">
                  Explorar equipos
                </Button>
              </Card>
            ) : null}
          </section>

          <Card aria-labelledby="titulo-comunidad">
            <div className="flex items-center justify-between gap-4">
              <h2 id="titulo-comunidad" className="text-heading-md font-semibold text-text">Tu voz hace comunidad</h2>
              <Link to="/cliente/valoraciones" className="hidden text-small font-semibold text-text lg:inline">Ver todas →</Link>
            </div>

            <Tabs
              label="Valoraciones"
              className="mt-4"
              items={[
                { id: 'enviadas', label: `Enviadas (${reviewsLoading ? '…' : reviewSummary?.sent.length || 0})`, activo: activeReviewTab === 'enviadas' },
                { id: 'recibidas', label: `Recibidas (${reviewsLoading ? '…' : reviewSummary?.received.length || 0})`, activo: activeReviewTab === 'recibidas' },
              ]}
              onSelect={setActiveReviewTab}
            />

            {reviewError && <p role="alert" className="mt-5 text-small text-danger">{reviewError}</p>}
            {reviewsLoading ? <p role="status" aria-live="polite" className="mt-5 text-small text-text-muted">Cargando tus valoraciones…</p> : v ? <div className="mt-5 flex items-start gap-3">
              <Avatar src={reviewProfile?.avatar_url} alt={`Foto de ${reviewName || 'usuario de Rentia'}`} className="size-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label font-semibold text-text">
                      Valoración {activeReviewTab === 'enviadas' ? 'para' : 'de'} {reviewName || 'usuario de Rentia'}
                    </p>
                    <p className="mt-1 text-caption text-text-muted">{v.equipment?.name || 'Equipo relacionado'}</p>
                  </div>
                  <StarRating size={12} value={v.rating} className="hidden shrink-0 lg:flex" />
                </div>
                <StarRating size={16} value={v.rating} className="mt-3 lg:hidden" />
                <p className="mt-3 text-small text-text-muted">{v.comment || 'Sin comentario.'}</p>
                {activeReviewTab === 'recibidas' && (
                  <Link to="/cliente/valoraciones" className="mt-3 hidden text-small font-semibold text-text lg:inline-block">
                    Ver valoración
                  </Link>
                )}
              </div>
            </div> : !reviewError ? <InfoBox
              title={activeReviewTab === 'enviadas' ? 'Aún no tienes valoraciones enviadas' : 'Aún no tienes valoraciones recibidas'}
              className="mt-5"
            >
              {activeReviewTab === 'enviadas'
                ? 'Cuando tengas una experiencia que compartir, abre la ficha del equipo para valorar al arrendador o al equipo.'
                : 'Cuando un arrendador valore tu experiencia, su opinión aparecerá aquí.'}
            </InfoBox> : null}

            <div className="mt-5 flex flex-col gap-3 lg:hidden">
              {activeReviewTab === 'recibidas' && v && (
                <Button as={Link} to="/cliente/valoraciones" variant="secondary" size="lg" fullWidth>
                  Ver valoración recibida
                </Button>
              )}
            </div>

            <div className="mt-5 hidden items-center justify-between gap-4 rounded-xl bg-surface-muted p-4 lg:flex">
              <p className="flex items-center gap-3 text-small text-text-muted">
                <Star size={16} aria-hidden="true" className="text-text" />
                Para valorar, abre la ficha del equipo que contactaste y elige qué experiencia quieres compartir.
              </p>
            </div>
          </Card>

          <TarjetaReputacion className="lg:hidden" reviewSummary={reviewSummary} loading={reviewsLoading} hasError={Boolean(reviewError)} />
          <Button as={Link} to="/cliente/valoraciones" variant="secondary" size="lg" fullWidth className="lg:hidden">
            Ver valoraciones
          </Button>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <TarjetaPerfil />
          <TarjetaReputacion reviewSummary={reviewSummary} loading={reviewsLoading} hasError={Boolean(reviewError)} />
        </aside>
      </div>
    </DashboardLayout>
  );
}
