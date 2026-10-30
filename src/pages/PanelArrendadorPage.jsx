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
import { loadOwnerEquipment } from '../services/equipmentService';
import { useEffect, useState } from 'react';

const COLUMNAS = 'md:grid-cols-[1fr_130px_180px_160px]';

function Estadistica({ valor, etiqueta }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 md:p-6">
      <p className="text-title-mobile font-semibold text-primary">{valor}</p>
      <p className="mt-1 text-small text-text-muted md:text-body">{etiqueta}</p>
    </div>
  );
}

function FilaEquipo({ equipo }) {
  const { nombre, lugar, actualizado, publicada, disponible, textoDisponibilidad } = equipo;
  return (
    <li className={`flex flex-col gap-3 border-t border-border px-4 py-4 md:grid md:items-center md:gap-4 md:px-6 ${COLUMNAS}`}>
      <div className="flex items-start gap-4">
        <ImagenNoEncontrada className="h-[72px] w-24 shrink-0 rounded-lg text-caption md:h-[72px] md:w-28" />
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
          <Toggle checked={disponible} label={`Disponibilidad de ${nombre}`} disabled={!publicada} />
          {textoDisponibilidad}
        </div>
      </div>

      <Button as={Link} to="/arrendador/equipos/editar" variant="secondary" size="lg" icon={Pencil} fullWidth className="md:hidden">
        {publicada ? 'Editar equipo' : 'Continuar publicación'}
      </Button>
      <div className="hidden md:block">
        <Link to="/arrendador/equipos/editar" className="inline-flex items-center gap-1 text-label font-semibold text-text">
          Editar equipo <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
        <Link to={publicada ? '/arrendador/equipos/gestionar' : '/arrendador/equipos/nuevo'} className="mt-2 block text-small text-text-muted">
          {publicada ? 'Ver publicación' : 'Continuar'}
        </Link>
      </div>
    </li>
  );
}

export default function PanelArrendadorPage() {
  const { session, profile } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadOwnerEquipment(session.user.id).then(setEquipment).catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const published = equipment.filter((item) => item.publication_status === 'publicada');
  const draft = equipment.filter((item) => item.publication_status === 'borrador');
  const formatDate = (date) => `Actualizado el ${new Date(date).toLocaleDateString('es-CO')}`;
  const items = equipment.map((item) => ({
    ...item,
    lugar: item.municipality,
    actualizado: formatDate(item.updated_at),
    publicada: item.publication_status === 'publicada',
    disponible: item.is_available,
    textoDisponibilidad: item.is_available ? 'Disponible' : 'No disponible',
  }));

  return (
    <DashboardLayout rol="arrendador" activo="equipos" movil="pestanas">
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
              { id: 'todas', label: `Todas (${equipment.length})`, activo: true },
              { id: 'publicadas', label: `Publicadas (${published.length})` },
              { id: 'borrador', label: `Borrador (${draft.length})` },
            ]}
          />
        </div>

        <div className={`hidden bg-surface-muted px-6 py-3 text-caption font-medium uppercase tracking-wide text-text-muted md:grid md:gap-4 ${COLUMNAS}`}>
          <span>Equipo</span>
          <span>Publicación</span>
          <span>Disponibilidad</span>
          <span>Acciones</span>
        </div>

        <ul>
          {error && <li className="p-5 text-small text-danger">{error}</li>}
          {!error && items.length === 0 && <li className="p-5 text-small text-text-muted">Aún no tienes equipos publicados.</li>}
          {items.map((equipo) => (
            <FilaEquipo key={equipo.id} equipo={equipo} />
          ))}
        </ul>
      </section>

      <InfoBox className="mt-6">
        La disponibilidad es el estado de tu publicación. Cámbiala cuando tu equipo no esté disponible y acuerda los detalles directamente con cada cliente.
      </InfoBox>

      <Card className="mt-6 md:mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Las buenas relaciones cuentan.</h2>
          <Link to="/perfil-publico" className="hidden whitespace-nowrap text-label font-semibold text-text md:inline">
            Ver valoraciones →
          </Link>
        </div>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-11" />
            <div>
              <p className="text-label font-semibold text-text">María López · Cliente</p>
              <p className="mt-0.5 text-small text-text-muted">Contacto por CAT 420F · Yopal · 12 oct.</p>
            </div>
          </div>
          <Button as={Link} to="/valoraciones/arrendador-a-cliente" variant="secondary" size="lg" className="w-full md:w-auto">
            Calificar cliente
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
