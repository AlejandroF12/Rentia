import { Link } from 'react-router-dom';
import { ArrowUpRight, Pencil, Plus } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import Toggle from '../components/Toggle';
import InfoBox from '../components/InfoBox';
import Avatar from '../components/Avatar';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { useAuth } from '../context/AuthContext';
import { loadOwnerEquipment, loadEquipmentImages, updateEquipmentAvailability } from '../services/equipmentService';
import { loadClientReviewSummary } from '../services/clientService';
import { useEffect, useState } from 'react';
import Skeleton from '../components/Skeleton';

const COLUMNAS = 'md:grid-cols-[1fr_130px_180px_160px]';

function Estadistica({ valor, etiqueta }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 md:p-6">
      <p className="text-title-mobile font-semibold text-primary">{valor}</p>
      <p className="mt-1 text-small text-text-muted md:text-body">{etiqueta}</p>
    </div>
  );
}

function FilaEquipo({ equipo, onAvailabilityChange }) {
  const { id, nombre, lugar, actualizado, publicada, disponible, textoDisponibilidad } = equipo;
  const equipmentQuery = `?id=${encodeURIComponent(id)}`;
  return (
    <li className={`flex flex-col gap-3 border-t border-border px-4 py-4 md:grid md:items-center md:gap-4 md:px-6 ${COLUMNAS}`}>
      <div className="flex items-start gap-4">
        {equipo.image ? <img src={equipo.image} alt="" className="h-[72px] w-24 shrink-0 rounded-lg object-cover md:h-[72px] md:w-28" /> : <ImagenNoEncontrada className="h-[72px] w-24 shrink-0 rounded-lg text-caption md:h-[72px] md:w-28" />}
        <div className="min-w-0">
          <p className="text-body-lg font-semibold text-text md:text-heading-sm">{nombre}</p>
          <p className="mt-1 text-small text-text-muted">{lugar}</p>
          <p className="mt-1 text-caption text-text-muted">{actualizado}</p>
        </div>
      </div>

      {/* En móvil: badge e interruptor en una fila. En escritorio se reparten en columnas. */}
      <div className="flex items-center justify-between md:contents">
        <div>
          <Badge tone={publicada ? 'success' : 'warning'}>{publicada ? 'Publicada' : 'Borrador'}</Badge>
        </div>
        <div className="flex items-center gap-2 text-small text-text-muted">
          <Toggle
            checked={disponible}
            label={`Disponibilidad de ${nombre}`}
            disabled={!publicada}
            onChange={() => onAvailabilityChange(id, !disponible)}
          />
          {textoDisponibilidad}
        </div>
      </div>

      <Button as={Link} to={`/arrendador/equipos/editar${equipmentQuery}`} variant="secondary" size="lg" icon={Pencil} fullWidth className="md:hidden">
        {publicada ? 'Editar equipo' : 'Continuar publicación'}
      </Button>
      <Button as={Link} to={`/arrendador/equipos/gestionar${equipmentQuery}`} variant="secondary" size="lg" fullWidth className="md:hidden">
        Gestionar publicación
      </Button>
      <div className="hidden md:block">
        <Link to={`/arrendador/equipos/editar${equipmentQuery}`} className="inline-flex items-center gap-1 text-label font-semibold text-text">
          Editar equipo <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
        <Link to={publicada ? `/detalle-equipo${equipmentQuery}` : `/arrendador/equipos/editar${equipmentQuery}`} className="mt-2 block text-small text-text-muted">
          {publicada ? 'Ver publicación' : 'Continuar'}
        </Link>
        <Link to={`/arrendador/equipos/gestionar${equipmentQuery}`} className="mt-2 block text-small text-text-muted">
          Gestionar publicación
        </Link>
      </div>
    </li>
  );
}

export default function PanelArrendadorPage() {
  const { session, profile } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todas');
  const [updatingId, setUpdatingId] = useState('');
  const [latestReview, setLatestReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadOwnerEquipment(session.user.id)
      .then(async (items) => {
        const withImages = await Promise.all(items.map(async (item) => {
          const images = await loadEquipmentImages(item.id);
          return { ...item, image: images[0]?.url || null };
        }));
        setEquipment(withImages);
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
    loadClientReviewSummary(session.user.id)
      .then((summary) => setLatestReview(summary.received[0] || null))
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const published = equipment.filter((item) => item.publication_status === 'publicada');
  const draft = equipment.filter((item) => item.publication_status === 'borrador');
  const formatDate = (date) => `Actualizado el ${new Date(date).toLocaleDateString('es-CO')}`;
  const filteredEquipment = equipment.filter((item) => (
    filter === 'todas'
      || (filter === 'publicadas' && item.publication_status === 'publicada')
      || (filter === 'borrador' && item.publication_status === 'borrador')
  ));
  const items = filteredEquipment.map((item) => ({
    ...item,
    nombre: item.name,
    lugar: item.municipality,
    actualizado: formatDate(item.updated_at),
    publicada: item.publication_status === 'publicada',
    disponible: item.is_available,
    textoDisponibilidad: item.is_available ? 'Disponible' : 'No disponible',
  }));
  const handleAvailabilityChange = async (equipmentId, isAvailable) => {
    if (!session?.user?.id || updatingId) return;
    setUpdatingId(equipmentId);
    setError('');
    try {
      const updated = await updateEquipmentAvailability(equipmentId, session.user.id, isAvailable);
      setEquipment((current) => current.map((item) => (
        item.id === equipmentId
          ? { ...item, is_available: updated.is_available, updated_at: updated.updated_at }
          : item
      )));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        eyebrow="Mi negocio / Arrendador"
        titulo="Tu equipo mueve el Llano."
        subtitulo={`Hola, ${profile?.full_name?.split(' ')[0] || 'arrendador'}. Mantén tus publicaciones al día.`}
        accion={
          <Button as={Link} to="/arrendador/equipos/nuevo" size="lg" icon={Plus} className="w-full md:w-auto">
            Agregar vehículo
          </Button>
        }
      />

      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={equipment.length} etiqueta="Equipos" />
        <Estadistica valor={published.length} etiqueta="Publicados" />
        <Estadistica valor="—" etiqueta="Tu valoración" />
      </div>

      <section aria-label="Mis equipos" className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface md:mt-8">
        <div className="px-4 py-4 md:px-6 md:py-5">
          <Tabs
            label="Filtrar equipos"
            items={[
              { id: 'todas', label: `Todas (${equipment.length})`,               activo: filter === 'todas' },
              { id: 'publicadas', label: `Publicadas (${published.length})`, activo: filter === 'publicadas' },
              { id: 'borrador', label: `Borrador (${draft.length})`, activo: filter === 'borrador' },
            ]}
            onSelect={setFilter}
          />
        </div>

        <div className={`hidden bg-surface-muted px-6 py-3 text-caption font-medium uppercase tracking-wide text-text-muted md:grid md:gap-4 ${COLUMNAS}`}>
          <span>Equipo</span>
          <span>Publicación</span>
          <span>Disponibilidad</span>
          <span>Acciones</span>
        </div>

        <ul>
          {loading && Array.from({ length: 3 }, (_, index) => <li key={index} className="border-t border-border px-4 py-4"><Skeleton className="h-[72px] w-full" /></li>)}
          {error && <li className="p-5 text-small text-danger">{error}</li>}
          {!loading && !error && items.length === 0 && <li className="p-5 text-small text-text-muted">
            {filter === 'todas' ? 'Aún no tienes equipos publicados.' : 'No hay equipos en este estado.'}
          </li>}
          {!loading && items.map((equipo) => (
          <FilaEquipo key={equipo.id} equipo={equipo} onAvailabilityChange={handleAvailabilityChange} />
          ))}
        </ul>
      </section>

      <InfoBox className="mt-6">
        La disponibilidad es el estado de tu publicación. Cámbiala cuando tu equipo no esté disponible y acuerda los detalles directamente con cada cliente.
      </InfoBox>

      <Card className="mt-6 md:mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Las buenas relaciones cuentan.</h2>
        </div>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {latestReview ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-11" />
              <div>
                <p className="text-label font-semibold text-text">{latestReview.author?.full_name || 'Cliente de Rentia'}</p>
                <p className="mt-0.5 text-small text-text-muted">
                  {latestReview.equipment?.name || 'Equipo relacionado'} · {new Date(latestReview.created_at).toLocaleDateString('es-CO')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-small text-text-muted">Aún no tienes valoraciones recibidas.</p>
          )}
          <Button as={Link} to="/arrendador/valoraciones" variant="secondary" size="lg" className="w-full md:w-auto">
            Ver valoraciones
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
