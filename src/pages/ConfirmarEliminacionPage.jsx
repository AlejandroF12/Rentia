import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import ConfirmarEliminacion from '../components/ConfirmarEliminacion';
import { useAuth } from '../context/AuthContext';
import { deleteEquipment, loadOwnerEquipmentById } from '../services/equipmentService';

export default function ConfirmarEliminacionPage() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('id');
  const [equipment, setEquipment] = useState(null);
  const [loadedKey, setLoadedKey] = useState('');
  const [error, setError] = useState('');
  const [deletedEquipmentId, setDeletedEquipmentId] = useState('');
  const [deleting, setDeleting] = useState(false);
  const missingIdError = !equipmentId ? 'No se indicó el equipo que deseas eliminar.' : '';
  const loadKey = `${session?.user?.id || ''}:${equipmentId || ''}`;

  useEffect(() => {
    if (!equipmentId || !session?.user?.id) return;
    loadOwnerEquipmentById(equipmentId, session.user.id, { includeEliminated: true })
      .then((loadedEquipment) => {
        setEquipment(loadedEquipment);
        setError('');
        setLoadedKey(`${session.user.id}:${equipmentId}`);
      })
      .catch((loadError) => {
        setEquipment(null);
        setError(loadError.message);
        setLoadedKey(`${session.user.id}:${equipmentId}`);
      });
  }, [equipmentId, session?.user?.id]);

  const handleDelete = async () => {
    if (!equipment || !session?.user?.id || deleting) return;
    setDeleting(true);
    setError('');
    try {
      await deleteEquipment(equipment.id, session.user.id);
      setDeletedEquipmentId(equipment.id);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeleting(false);
    }
  };

  if (missingIdError || (error && !equipment)) {
    return (
      <DashboardLayout rol="arrendador" activo="equipos">
        <p role="alert" className="text-small text-danger">{error || missingIdError}</p>
      </DashboardLayout>
    );
  }

  if (loadedKey !== loadKey || !equipment) {
    return <DashboardLayout rol="arrendador" activo="equipos"><p className="text-small text-text-muted">Cargando equipo...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: `/arrendador/equipos/gestionar?id=${encodeURIComponent(equipment.id)}`, texto: 'Volver a gestionar publicación' }}
        eyebrow="Mis equipos / Confirmación"
        titulo="Antes de eliminar tu equipo."
        subtitulo="Esta decisión es permanente. Si solo necesitas una pausa, deja de publicar."
      />

      {error && <p role="alert" className="mb-4 text-small text-danger">{error}</p>}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <ConfirmarEliminacion key={equipment.id} nombre={equipment.name} equipoId={equipment.id} resultado={deletedEquipmentId === equipment.id} onConfirm={handleDelete} submitting={deleting} />
        <aside className="space-y-4">
          <InfoBox title="Equipo seleccionado">{equipment.name} · {equipment.municipality}</InfoBox>
          <Card className="p-5">
            <h2 className="text-heading-sm font-semibold text-text">Antes de decidir</h2>
            <p className="mt-4 text-small text-text-muted">
              No disponible mantiene la ficha visible. Sin publicar la oculta de forma reversible. Eliminada no permite recuperación.
            </p>
            <Link to={`/arrendador/equipos/gestionar?id=${encodeURIComponent(equipment.id)}`} className="mt-4 inline-block text-small font-semibold text-text">
              Volver a gestionar
            </Link>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
