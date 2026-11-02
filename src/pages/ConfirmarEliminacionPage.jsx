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
  const [error, setError] = useState('');
  const [deleted, setDeleted] = useState(false);
  const missingIdError = !equipmentId ? 'No se indicó el equipo que deseas eliminar.' : '';

  useEffect(() => {
    if (!equipmentId || !session?.user?.id) return;
    loadOwnerEquipmentById(equipmentId, session.user.id)
      .then(setEquipment)
      .catch((loadError) => setError(loadError.message));
  }, [equipmentId, session?.user?.id]);

  const handleDelete = async () => {
    if (!equipment || !session?.user?.id) return;
    try {
      await deleteEquipment(equipment.id, session.user.id);
      setDeleted(true);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (missingIdError || error) {
    return (
      <DashboardLayout rol="arrendador" activo="equipos">
        <p role="alert" className="text-small text-danger">{error || missingIdError}</p>
      </DashboardLayout>
    );
  }

  if (!equipment) {
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <ConfirmarEliminacion nombre={equipment.name} equipoId={equipment.id} resultado={deleted} onConfirm={handleDelete} />
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
