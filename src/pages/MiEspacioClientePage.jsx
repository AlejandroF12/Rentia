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
import { equipos } from '../data/muestra';
import { clienteMuestra } from '../data/panel';
import { useAuth } from '../context/AuthContext';
import { loadClientReviewSummary } from '../services/clientService';
import { useEffect, useState } from 'react';

function TarjetaPerfil({ className = '' }) {
  const { profile } = useAuth();
  const c = {
    nombre: profile?.full_name || 'Tu perfil',
    detalle: profile?.municipality ? `Cliente · ${profile.municipality}` : 'Cliente',
    correo: profile?.email || 'Correo no disponible',
    celular: profile?.phone || 'No registrado',
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
        <Avatar className="size-14 lg:size-16" />
        <div>
          <p className="text-heading-sm font-semibold text-text lg:text-heading-lg">{c.nombre}</p>
          <p className="mt-1 text-small text-text-muted">{c.detalle}</p>
        </div>
      </div>
      <Badge tone="success" className="mt-4">Perfil activo</Badge>
      <div className="mt-4 space-y-4 border-t border-border pt-4">
        {dato('Correo', c.correo)}
        {dato('Celular', c.celular)}
        {dato('En la comunidad desde', c.desde)}
      </div>
      <Button as={Link} to="/cliente/perfil" variant="secondary" size="lg" icon={Pencil} fullWidth className="mt-5">
        Editar mi perfil
      </Button>
    </Card>
  );
}

function TarjetaReputacion({ className = '', reviewSummary }) {
  const r = reviewSummary;
  return (
    <section className={`rounded-2xl bg-primary p-5 text-primary-foreground md:p-6 ${className}`}>
      <p className="text-small text-text-inverse-muted">Tu reputación como cliente</p>
      {r?.received.length ? (
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
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewError, setReviewError] = useState('');
  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientReviewSummary(session.user.id).then(setReviewSummary).catch((error) => setReviewError(error.message));
  }, [session?.user?.id]);
  const favoritos = [equipos[0], equipos[2]];
  const v = reviewSummary?.sent[0];

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
          <Estadistica valor={clienteMuestra.favoritos} etiqueta="Favoritos" />
          <Estadistica valor={clienteMuestra.enviadas} etiqueta="Enviadas" />
          <Estadistica valor={clienteMuestra.recibidas} etiqueta="Recibidas" />
        </div>

        <div className="min-w-0 space-y-6">
          <section aria-labelledby="titulo-favoritos">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="titulo-favoritos" className="text-heading-md font-semibold text-text lg:text-heading-lg">Equipos que te interesan</h2>
              <span className="hidden text-small text-text-muted lg:inline">2 favoritos</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {favoritos.map((equipo) => (
                <EquipoCard key={equipo.id} equipo={equipo} />
              ))}
            </div>
          </section>

          <Card aria-labelledby="titulo-comunidad">
            <div className="flex items-center justify-between gap-4">
              <h2 id="titulo-comunidad" className="text-heading-md font-semibold text-text">Tu voz hace comunidad</h2>
              <Link to="/cliente/valoraciones" className="hidden text-small font-semibold text-text lg:inline">Ver todas →</Link>
            </div>

            <Tabs
              label="Valoraciones"
              className="mt-4 hidden lg:flex"
              items={[
                { id: 'enviadas', label: `Enviadas (${reviewSummary?.sent.length || 0})`, activo: true },
                { id: 'recibidas', label: `Recibidas (${reviewSummary?.received.length || 0})` },
              ]}
            />
            <p className="mt-3 text-small text-text-muted lg:hidden">Enviadas ({reviewSummary?.sent.length || 0}) · Recibidas ({reviewSummary?.received.length || 0})</p>

            {reviewError && <p role="alert" className="mt-5 text-small text-danger">{reviewError}</p>}
            {v ? <div className="mt-5 flex items-start gap-3">
              <Avatar className="size-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-label font-semibold text-text">Valoración para {v.target?.full_name || 'usuario de Rentia'}</p>
                    <p className="mt-1 text-caption text-text-muted">{v.equipment?.name || 'Equipo relacionado'}</p>
                  </div>
                  <StarRating size={12} value={v.rating} className="hidden shrink-0 lg:flex" />
                </div>
                <StarRating size={16} value={v.rating} className="mt-3 lg:hidden" />
                <p className="mt-3 text-small text-text-muted">{v.comment}</p>
                <Link to="/valoraciones/cliente-a-arrendador" className="mt-3 hidden text-small font-semibold text-text lg:inline-block">
                  Editar mi valoración
                </Link>
              </div>
            </div> : <InfoBox title="Aún no tienes valoraciones publicadas" className="mt-5">
                Cuando valores a un arrendador después de contactarlo, tu opinión aparecerá aquí.
              </InfoBox>}

            <div className="mt-5 flex flex-col gap-3 lg:hidden">
              <Button as={Link} to="/valoraciones/cliente-a-arrendador" variant="secondary" size="lg" fullWidth>Editar mi valoración</Button>
              <Button as={Link} to="/valoraciones/politica" variant="secondary" size="lg" fullWidth>Calificar otro contacto</Button>
            </div>

            <div className="mt-5 hidden items-center justify-between gap-4 rounded-xl bg-surface-muted p-4 lg:flex">
              <p className="flex items-center gap-3 text-small text-text-muted">
                <Star size={16} aria-hidden="true" className="text-text" />
                ¿Contactaste a un propietario? Comparte tu experiencia con la comunidad.
              </p>
              <Link to="/valoraciones/politica" className="whitespace-nowrap text-label font-semibold text-text">Calificar →</Link>
            </div>
          </Card>

          <TarjetaReputacion className="lg:hidden" reviewSummary={reviewSummary} />
          <Button as={Link} to="/cliente/valoraciones" variant="secondary" size="lg" fullWidth className="lg:hidden">
            Ver valoraciones
          </Button>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <TarjetaPerfil />
          <TarjetaReputacion reviewSummary={reviewSummary} />
        </aside>
      </div>
    </DashboardLayout>
  );
}
