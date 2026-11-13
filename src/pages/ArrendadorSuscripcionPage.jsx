import PageHeader from '../components/PageHeader';
import SuscripcionArrendador from '../components/SuscripcionArrendador';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ArrendadorSuscripcionPage() {
  return (
    <DashboardLayout rol="arrendador" activo="suscripcion">
      <PageHeader
        breadcrumb="Mi negocio / Suscripción"
        eyebrow="Mi negocio"
        titulo="Tu suscripción de Rentia."
        subtitulo="Consulta el periodo de prueba y el estado de acceso a las funciones de arrendador."
      />
      <SuscripcionArrendador className="mt-6 max-w-2xl" />
    </DashboardLayout>
  );
}
