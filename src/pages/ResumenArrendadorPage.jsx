import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, ClipboardCheck, Eye, Plus, Star, Truck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import { Puntaje } from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { loadOwnerEquipment } from '../services/equipmentService';
import { loadClientReviewSummary } from '../services/clientService';
import { loadLandlordSubscription } from '../services/subscriptionService';

const equipmentStatuses = {
  publicada: { label: 'Publicada', tone: 'success' },
  borrador: { label: 'Borrador', tone: 'neutral' },
  revision: { label: 'En revisión', tone: 'warning' },
  oculta: { label: 'Oculta', tone: 'neutral' },
  suspendida: { label: 'Suspendida', tone: 'danger' },
};

const subscriptionStatuses = {
  prueba: { label: 'Periodo de prueba', tone: 'success' },
  activa: { label: 'Activa', tone: 'success' },
  vencida: { label: 'Vencida', tone: 'danger' },
};

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Metric({ label, value, detail, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-small text-text-muted">{label}</p>
          <p className="mt-2 text-title-mobile font-semibold text-text">{value}</p>
          {detail && <p className="mt-1 text-caption text-text-muted">{detail}</p>}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-alpha-14 text-primary">
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

function ErrorMessage({ children }) {
  return <p role="alert" className="mt-3 text-small text-danger">{children}</p>;
}

export default function ResumenArrendadorPage() {
  const { session, profile } = useAuth();
  const userId = session?.user?.id;
  const [equipment, setEquipment] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;

    Promise.allSettled([
      loadOwnerEquipment(userId),
      loadClientReviewSummary(userId),
      loadLandlordSubscription(userId, profile?.created_at),
    ]).then(([equipmentResult, reviewResult, subscriptionResult]) => {
      if (!active) return;
      const nextErrors = {};
      if (equipmentResult.status === 'fulfilled') {
        setEquipment(equipmentResult.value);
      } else {
        nextErrors.equipment = equipmentResult.reason?.message || 'No se pudieron cargar tus equipos.';
      }
      if (reviewResult.status === 'fulfilled') {
        setReviewSummary(reviewResult.value);
      } else {
        nextErrors.reviews = reviewResult.reason?.message || 'No se pudieron cargar tus valoraciones.';
      }
      if (subscriptionResult.status === 'fulfilled') {
        setSubscription(subscriptionResult.value);
      } else {
        nextErrors.subscription = subscriptionResult.reason?.message || 'No se pudo consultar tu suscripción.';
      }
      setErrors(nextErrors);
      setLoading(false);
    });

    return () => { active = false; };
  }, [userId, profile?.created_at]);

  const published = equipment.filter((item) => item.publication_status === 'publicada');
  const available = published.filter((item) => item.is_available);
  const notPublished = equipment.filter((item) => item.publication_status !== 'publicada');
  const reviews = reviewSummary?.received ?? [];
  const average = reviewSummary?.average;
  const firstDraft = equipment.find((item) => item.publication_status === 'borrador');
  const recentEquipment = equipment.slice(0, 5);
  const subscriptionStatus = subscriptionStatuses[subscription?.status];

  const recommendations = [];
  if (!errors.equipment && equipment.length === 0) {
    recommendations.push({
      title: 'Publica tu primer equipo',
      description: 'Completa la información para que los clientes puedan encontrarte.',
      to: '/arrendador/equipos/nuevo',
      action: 'Agregar equipo',
    });
  }
  if (firstDraft) {
    recommendations.push({
      title: `Continúa “${firstDraft.name}”`,
      description: 'Este equipo está guardado como borrador y todavía no aparece en el catálogo.',
      to: `/arrendador/equipos/editar?id=${encodeURIComponent(firstDraft.id)}`,
      action: 'Continuar',
    });
  }
  if (profile?.contact_authorized !== true) {
    recommendations.push({
      title: 'Habilita tus datos de contacto',
      description: 'Autoriza mostrar tu celular a clientes con sesión activa para facilitar el contacto.',
      to: '/arrendador/perfil',
      action: 'Revisar perfil',
    });
  }
  if (subscription?.status === 'vencida') {
    recommendations.push({
      title: 'Tu acceso está vencido',
      description: 'Consulta el estado de tu suscripción y las opciones disponibles.',
      to: '/arrendador/suscripcion',
      action: 'Ver suscripción',
    });
  }
  if (!errors.reviews && reviews.length === 0 && equipment.length > 0) {
    recommendations.push({
      title: 'Aún no tienes valoraciones',
      description: 'Cuando recibas una, podrás revisar aquí tu reputación y los comentarios.',
      to: '/arrendador/valoraciones',
      action: 'Ver valoraciones',
    });
  }

  return (
    <DashboardLayout rol="arrendador" activo="resumen">
      <PageHeader
        eyebrow="Mi negocio / Resumen"
        titulo={`Hola, ${profile?.full_name?.split(' ')[0] || 'arrendador'}.`}
        subtitulo="Revisa tus publicaciones, reputación y próximos pasos para mantener tu negocio al día."
        accion={<Button as={Link} to="/arrendador/equipos/nuevo" size="lg" icon={Plus}>Agregar equipo</Button>}
      />

      {Object.entries(errors).map(([key, message]) => (
        <ErrorMessage key={key}>{message}</ErrorMessage>
      ))}

      {profile?.contact_authorized !== true && (
        <Card tone="danger" className="mt-6">
          <h2 className="text-label font-semibold text-text">Tu celular no está habilitado para recibir contactos</h2>
          <p className="mt-2 text-small text-text-muted">
            Los clientes con sesión activa no podrán ver tu teléfono. Puedes cambiar esta autorización desde tu perfil.
          </p>
          <Link to="/arrendador/perfil" className="mt-3 inline-flex min-h-11 items-center gap-1 text-small font-semibold text-text">
            Revisar mi perfil <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </Card>
      )}

      <section aria-label="Indicadores de mi negocio" className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        <Metric label="Equipos publicados" value={errors.equipment ? '—' : published.length} detail={`de ${errors.equipment ? '—' : equipment.length} equipos`} icon={Eye} />
        <Metric label="Disponibles" value={errors.equipment ? '—' : available.length} detail="Listos para recibir consultas" icon={Truck} />
        <Metric label="Valoración promedio" value={errors.reviews ? '—' : average === null || average === undefined ? '—' : average.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} detail={errors.reviews ? 'No disponible' : `${reviews.length} valoración${reviews.length === 1 ? '' : 'es'} recibida${reviews.length === 1 ? '' : 's'}`} icon={Star} />
        <Metric label="No publicados" value={errors.equipment ? '—' : notPublished.length} detail="Borradores y otros estados" icon={ClipboardCheck} />
      </section>

      <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-heading-md font-semibold text-text">Estado de tu acceso</h2>
              <p className="mt-1 text-small text-text-muted">Consulta el periodo vigente de tu cuenta.</p>
            </div>
            {subscriptionStatus && <Badge tone={subscriptionStatus.tone}>{subscriptionStatus.label}</Badge>}
          </div>
          {errors.subscription ? (
            <ErrorMessage>{errors.subscription}</ErrorMessage>
          ) : loading ? (
            <p className="mt-4 text-small text-text-muted" aria-busy="true">Consultando estado…</p>
          ) : subscription ? (
            <>
              <p className="mt-4 text-body text-text-muted">
                {subscription.isActive
                  ? `Tienes ${subscription.remainingDays} día${subscription.remainingDays === 1 ? '' : 's'} de acceso, hasta el ${formatDate(subscription.endsAt)}.`
                  : `Tu acceso venció el ${formatDate(subscription.endsAt)}.`}
              </p>
              <Link to="/arrendador/suscripcion" className="mt-3 inline-flex min-h-11 items-center gap-1 text-small font-semibold text-primary">
                Ir a suscripción <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <p className="mt-4 text-small text-text-muted">No hay información de suscripción disponible.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-heading-md font-semibold text-text">Acciones recomendadas</h2>
              <p className="mt-1 text-small text-text-muted">Siguientes pasos para tu cuenta.</p>
            </div>
            <Link to="/arrendador/equipos" aria-label="Ver todos mis equipos" className="inline-flex size-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted">
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          {loading ? (
            <p className="mt-4 text-small text-text-muted" aria-busy="true">Revisando tu cuenta…</p>
          ) : recommendations.length ? (
            <ul className="mt-3 divide-y divide-border">
              {recommendations.slice(0, 3).map((recommendation) => (
                <li key={recommendation.title} className="py-3">
                  <p className="text-label font-semibold text-text">{recommendation.title}</p>
                  <p className="mt-1 text-small text-text-muted">{recommendation.description}</p>
                  <Link to={recommendation.to} className="mt-2 inline-flex min-h-10 items-center gap-1 text-small font-semibold text-primary">
                    {recommendation.action} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-small text-text-muted">
              No hay acciones urgentes. Mantén actualizada la disponibilidad de tus equipos.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between gap-3 p-5 md:p-6">
            <div>
              <h2 className="text-heading-md font-semibold text-text">Actividad de tus equipos</h2>
              <p className="mt-1 text-small text-text-muted">Actualizados recientemente.</p>
            </div>
            <Link to="/arrendador/equipos" className="text-small font-semibold text-primary">Ver todos</Link>
          </div>
          {loading && <p className="px-5 pb-5 text-small text-text-muted" aria-busy="true">Cargando equipos…</p>}
          {!loading && !errors.equipment && recentEquipment.length === 0 && (
            <p className="px-5 pb-5 text-small text-text-muted">Aún no tienes equipos. Agrega el primero para comenzar.</p>
          )}
          {!errors.equipment && recentEquipment.length > 0 && (
            <ul className="divide-y divide-border">
              {recentEquipment.map((item) => {
                const status = equipmentStatuses[item.publication_status] || { label: item.publication_status, tone: 'neutral' };
                const actionHref = item.publication_status === 'publicada'
                  ? `/detalle-equipo?id=${encodeURIComponent(item.id)}`
                  : item.publication_status === 'borrador'
                    ? `/arrendador/equipos/editar?id=${encodeURIComponent(item.id)}`
                    : `/arrendador/equipos/gestionar?id=${encodeURIComponent(item.id)}`;
                const actionText = item.publication_status === 'publicada'
                  ? 'Ver publicación'
                  : item.publication_status === 'borrador'
                    ? 'Continuar'
                    : 'Gestionar';
                return (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
                    <div className="min-w-0">
                      <p className="truncate text-label font-semibold text-text">{item.name}</p>
                      <p className="mt-1 text-caption text-text-muted">
                        {item.municipality || 'Ubicación no registrada'}
                        {item.publication_status === 'publicada' ? ` · ${item.is_available ? 'Disponible' : 'No disponible'}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      <Link to={actionHref} className="text-small font-semibold text-primary">{actionText}</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-heading-md font-semibold text-text">Valoraciones recientes</h2>
              <p className="mt-1 text-small text-text-muted">Lo que tus clientes opinan.</p>
            </div>
            <Link to="/arrendador/valoraciones" className="text-small font-semibold text-primary">Ver todas</Link>
          </div>
          {loading && <p className="mt-4 text-small text-text-muted" aria-busy="true">Cargando valoraciones…</p>}
          {!loading && !errors.reviews && reviews.length === 0 && (
            <p className="mt-4 text-small text-text-muted">Aún no has recibido valoraciones publicadas.</p>
          )}
          {!errors.reviews && reviews.length > 0 && (
            <ul className="mt-3 divide-y divide-border">
              {reviews.slice(0, 3).map((review) => (
                <li key={review.id} className="flex gap-3 py-4 first:pt-3">
                  <Avatar
                    src={review.author?.avatar_url}
                    alt={`Foto de ${review.author?.full_name || 'cliente de Rentia'}`}
                    className="size-10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-small font-semibold text-text">{review.author?.full_name || 'Cliente de Rentia'}</p>
                      <Puntaje valor={review.rating} />
                    </div>
                    <p className="mt-1 text-caption text-text-muted">
                      {review.equipment?.name || 'Equipo relacionado'} · {formatDate(review.created_at)}
                    </p>
                    {review.comment && <p className="mt-2 line-clamp-3 text-small text-text-muted">{review.comment}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
