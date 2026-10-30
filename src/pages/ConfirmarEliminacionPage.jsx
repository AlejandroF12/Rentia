import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import ConfirmarEliminacion from '../components/ConfirmarEliminacion';

export default function ConfirmarEliminacionPage() {
  return (
    <DashboardLayout rol="arrendador" activo="equipos">
      <PageHeader
        volver={{ to: '/arrendador/equipos/gestionar', texto: 'Volver a gestionar publicación' }}
        eyebrow="Mis equipos / Confirmación"
        titulo="Antes de eliminar tu equipo."
        subtitulo="Esta decisión es permanente. Si solo necesitas una pausa, deja de publicar."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <ConfirmarEliminacion />
        <aside className="space-y-4">
          <InfoBox title="Equipo seleccionado">Retroexcavadora CAT 420F · Carlos Rojas · Yopal</InfoBox>
          <Card className="p-5">
            <h2 className="text-heading-sm font-semibold text-text">Antes de decidir</h2>
            <p className="mt-4 text-small text-text-muted">
              No disponible mantiene la ficha visible. Sin publicar la oculta de forma reversible. Eliminada no permite recuperación.
            </p>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
