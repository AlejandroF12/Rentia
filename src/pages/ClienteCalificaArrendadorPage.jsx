import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { valoracionCliente as datos } from '../data/panel';

export default function ClienteCalificaArrendadorPage() {
  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: '/cliente/valoraciones', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      <FormularioValoracion datos={datos} volverA="/cliente/valoraciones" />
    </DashboardLayout>
  );
}
