import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import FormularioEquipo from '../components/FormularioEquipo';
import { equipoCat } from '../data/panel';

export default function EditarVehiculoPage() {
  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Actualiza tu publicación"
        titulo="Editar vehículo"
        subtitulo="Mantén la información y disponibilidad al día."
        accion={<Badge tone="success" className="self-start">Publicada</Badge>}
      />
      <FormularioEquipo modo="editar" equipo={equipoCat} />
    </DashboardLayout>
  );
}
