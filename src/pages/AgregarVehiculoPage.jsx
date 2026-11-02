import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import FormularioEquipo from '../components/FormularioEquipo';

const equipoVacio = {
  nombre: '',
  categoria: '',
  marca: '',
  anio: '',
  caracteristica: '',
  descripcion: '',
  municipio: '',
  municipioCorto: '',
  sector: '',
  fotos: 0,
  disponible: true,
};

export default function AgregarVehiculoPage() {
  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Dale visibilidad a tu equipo"
        titulo="Agregar vehículo"
        subtitulo="Fotos claras y datos sencillos para conectar mejor."
        accion={<Badge tone="warning" className="self-start">Borrador sin publicar</Badge>}
      />
      <FormularioEquipo modo="agregar" equipo={equipoVacio} />
    </DashboardLayout>
  );
}
