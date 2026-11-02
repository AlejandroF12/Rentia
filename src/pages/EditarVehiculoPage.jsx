import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import FormularioEquipo from '../components/FormularioEquipo';
import { loadOwnerEquipmentById } from '../services/equipmentService';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function EditarVehiculoPage() {
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('id');
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState('');
  const { session } = useAuth();
  const missingIdError = !equipmentId ? 'No se indicó el equipo que deseas editar.' : '';

  useEffect(() => {
    if (!equipmentId) {
      return;
    }
    if (!session?.user?.id) return;
    loadOwnerEquipmentById(equipmentId, session.user.id)
      .then((item) => setEquipment({
        ...item,
        nombre: item.name,
        categoria: item.category,
        marca: item.brand || '',
        anio: item.model_year || '',
        caracteristica: item.main_feature || '',
        descripcion: item.description || '',
        municipio: item.municipality,
        municipioCorto: item.municipality.split(',')[0],
        sector: item.sector || '',
        fotos: 0,
        disponible: item.is_available,
      }))
      .catch((loadError) => setError(loadError.message));
  }, [equipmentId, session?.user?.id]);

  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Actualiza tu publicación"
        titulo="Editar vehículo"
        subtitulo="Mantén la información y disponibilidad al día."
        accion={<Badge tone="success" className="self-start">Publicada</Badge>}
      />
      {(error || missingIdError) && <p role="alert" className="mt-6 text-small text-danger">{error || missingIdError}</p>}
      {equipment && <FormularioEquipo modo="editar" equipo={equipment} />}
    </DashboardLayout>
  );
}
