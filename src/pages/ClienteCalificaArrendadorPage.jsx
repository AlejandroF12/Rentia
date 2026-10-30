import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { valoracionCliente as datos } from '../data/panel';

export default function ClienteCalificaArrendadorPage() {
  return (
    <PaginaCuenta rol="cliente">
      <PageHeader
        volver={{ to: '/cliente', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      <FormularioValoracion datos={datos} volverA="/cliente" />
    </PaginaCuenta>
  );
}
