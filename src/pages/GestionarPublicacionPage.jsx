import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Badge, { EstadoBadge } from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { Puntaje } from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import {
  loadOwnerEquipmentById,
  updateEquipmentPublication,
} from '../services/equipmentService';

function EquipoResumen({ equipment }) {
  const query = `?id=${encodeURIComponent(equipment.id)}`;
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <ImagenNoEncontrada className="aspect-[16/7] w-full md:aspect-[16/9]" />
      <div className="p-4">
        <EstadoBadge disponible={equipment.is_available} />
        <p className="mt-3 text-caption uppercase tracking-wide text-text-muted">{equipment.category}</p>
        <h3 className="mt-2 text-heading-sm font-semibold text-text">{equipment.name}</h3>
        <div className="mt-2 flex items-center justify-between text-small text-text-muted">
          <span>{equipment.municipality}</span>
          <Puntaje valor="—" />
        </div>
        <Link to={`/detalle-equipo${query}`} className="mt-3 flex items-center justify-between border-t border-border pt-3 text-label font-semibold text-text">
          Ver equipo <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function GestionarPublicacionPage() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('id');
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const missingIdError = !equipmentId ? 'No se indicó el equipo que deseas gestionar.' : '';

  useEffect(() => {
    if (!equipmentId || !session?.user?.id) return;
    loadOwnerEquipmentById(equipmentId, session.user.id)
      .then(setEquipment)
      .catch((loadError) => setError(loadError.message));
  }, [equipmentId, session?.user?.id]);

  const changePublication = async (publicationStatus) => {
    if (!equipment || !session?.user?.id || updating) return;
    setUpdating(true);
    setError('');
    try {
      const updated = await updateEquipmentPublication(equipment.id, session.user.id, publicationStatus);
      setEquipment((current) => ({ ...current, ...updated }));
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdating(false);
    }
  };

  if (missingIdError || error) {
    return (
      <PaginaCuenta rol="arrendador">
        <p role="alert" className="text-small text-danger">{error || missingIdError}</p>
      </PaginaCuenta>
    );
  }

  if (!equipment) {
    return <PaginaCuenta rol="arrendador"><p className="text-small text-text-muted">Cargando publicación...</p></PaginaCuenta>;
  }

  const published = equipment.publication_status === 'publicada';
  const query = `?id=${encodeURIComponent(equipment.id)}`;

  return (
    <PaginaCuenta rol="arrendador">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow={`Mis equipos / ${equipment.name}`}
        titulo="Tú decides cuándo mostrarlo."
        subtitulo="Gestiona la visibilidad sin confundirla con la disponibilidad."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="lg:hidden"><EquipoResumen equipment={equipment} /></div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">Visibilidad actual</h2>
            <Badge tone={published ? 'success' : 'warning'} className="mt-4">
              {published ? 'Publicada' : 'Oculta'} · {equipment.is_available ? 'Disponible' : 'No disponible'}
            </Badge>
            <p className="mt-4 text-body text-text-muted">{equipment.name} · {equipment.municipality}</p>

            <Button
              type="button"
              size="lg"
              icon={published ? EyeOff : Eye}
              fullWidth
              className="mt-4"
              disabled={updating}
              onClick={() => changePublication(published ? 'oculta' : 'publicada')}
            >
              {updating ? 'Guardando...' : published ? 'Dejar de publicar' : 'Volver a publicar'}
            </Button>

            <InfoBox tone="muted" className="mt-4">
              {published
                ? 'Ocultar conserva los datos y permite volver a publicar el equipo.'
                : 'Volver a publicar mostrará la ficha en el catálogo; no cambia su disponibilidad.'}
            </InfoBox>
          </Card>

          <Card>
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">¿Solo no está disponible?</h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">
              Mantén la publicación visible y cambia el estado de disponibilidad desde Mis equipos o Editar vehículo.
            </p>
            <Button as={Link} to={`/arrendador/equipos/editar${query}`} variant="secondary" size="lg" fullWidth className="mt-5">
              Editar disponibilidad
            </Button>
          </Card>

          <Card tone="danger">
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">Eliminar permanentemente</h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">Úsalo solo si no quieres conservar esta publicación. No se puede deshacer.</p>
            <div className="mt-5 flex justify-center">
              <Button as={Link} to={`/arrendador/equipos/eliminar${query}`} variant="secondary" size="lg" icon={Trash2} className="text-danger">
                Eliminar publicación
              </Button>
            </div>
          </Card>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <EquipoResumen equipment={equipment} />
          <Card tone="muted">
            <h2 className="text-heading-md font-semibold text-text">Tres estados distintos</h2>
            <dl className="mt-5 space-y-5 text-small text-text-muted">
              <div><dt className="text-label font-semibold">No disponible</dt><dd className="mt-1">La ficha sigue visible, pero el equipo no está disponible.</dd></div>
              <div><dt className="text-label font-semibold">Sin publicar</dt><dd className="mt-1">La ficha está oculta y puedes volver a publicarla.</dd></div>
              <div><dt className="text-label font-semibold">Eliminada</dt><dd className="mt-1">La ficha se retira de forma permanente.</dd></div>
            </dl>
          </Card>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
