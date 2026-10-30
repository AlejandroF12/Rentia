import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { valoracionArrendador as datos } from '../data/panel';

export default function ArrendadorCalificaClientePage() {
  return (
    <PaginaCuenta rol="arrendador">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      <FormularioValoracion datos={datos} volverA="/arrendador/equipos" />
    </PaginaCuenta>
  );
}
