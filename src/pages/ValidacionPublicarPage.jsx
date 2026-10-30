import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioEquipo from '../components/FormularioEquipo';
import { equipoKomatsu } from '../data/panel';

/** Agregar vehículo con errores de validación (maqueta: errores fijos). */
const errores = {
  fotos: 'Agrega al menos una fotografía del equipo.',
  categoria: 'Selecciona la categoría del equipo.',
  municipio: 'Selecciona el municipio y fija un punto manual.',
};

export default function ValidacionPublicarPage() {
  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Agregar vehículo / Revisión"
        titulo="Completa tu publicación."
        subtitulo="Tu información sigue aquí. Corrige los campos señalados para publicar."
      />
      <FormularioEquipo modo="revision" equipo={{ ...equipoKomatsu, fotos: 0 }} errores={errores} />
    </DashboardLayout>
  );
}
