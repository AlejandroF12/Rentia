import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import InfoBox from '../components/InfoBox';
import TileEquipo from '../components/TileEquipo';

export default function ReporteEnviadoPage() {
  return (
    <PaginaCuenta rol="cliente" ancho="estrecho">
      <PageHeader
        volver={{ to: '/catalogo', texto: 'Volver a explorar' }}
        eyebrow="Reporte de publicación"
        titulo="Gracias por estar pendiente."
        subtitulo="Tu aporte ayuda a cuidar Rentia."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
        <section aria-label="Reporte enviado" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success md:size-16">
            <span className="flex size-6 items-center justify-center rounded-full border border-current">
              <Check size={14} aria-hidden="true" />
            </span>
          </span>
          <h2 className="mt-5 text-heading-md font-semibold text-text md:mt-6">Reporte enviado</h2>
          <Badge tone="success" className="mt-4">REP-108 · Recibido</Badge>

          <TileEquipo nombre="Cargador frontal" detalle="Pablo Ortega · Aguazul" className="mt-5" />

          <p className="mt-6 text-body font-semibold text-text-muted">Fotos que no pertenecen al vehículo</p>
          <p className="mt-4 text-body text-text-muted">
            Conserva la referencia REP-108 si necesitas consultar el caso desde el Centro de ayuda.
          </p>

          <InfoBox title="Tratamiento privado" className="mt-5">
            Tu identidad y explicación no se muestran en la publicación. El reporte no supone una sanción automática.
          </InfoBox>

          <div className="mt-5 flex flex-col gap-3">
            <Button as={Link} to="/catalogo" size="lg" fullWidth>Volver al catálogo</Button>
            <Button as={Link} to="/detalle-equipo" variant="secondary" size="lg" fullWidth>Volver a la publicación</Button>
          </div>
        </section>

        <aside className="hidden rounded-2xl bg-surface-muted p-6 lg:block">
          <h2 className="text-heading-md font-semibold text-text">¿Qué pasa ahora?</h2>
          <p className="mt-5 text-body text-text-muted">
            Administración revisará el contenido y el motivo antes de tomar medidas. La publicación puede mantenerse visible durante la revisión.
          </p>
          <p className="mt-5 text-body text-text-muted">
            No es una conversación con el propietario ni un canal de negociación.
          </p>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
