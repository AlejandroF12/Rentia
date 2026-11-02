import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioEquipo from '../components/FormularioEquipo';

/** Revisión de una publicación incompleta sin rellenar datos ficticios. */
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
      <FormularioEquipo
        modo="revision"
        equipo={{
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
          celular: '',
        }}
        errores={errores}
      />
    </DashboardLayout>
  );
}
