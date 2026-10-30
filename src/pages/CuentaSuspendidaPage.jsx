import { Link } from 'react-router-dom';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import InfoBox from '../components/InfoBox';

export default function CuentaSuspendidaPage() {
  return (
    <PaginaCuenta rol={null}>
      <PageHeader
        breadcrumb="Estado de cuenta / Pablo Ortega"
        eyebrow="Estado de cuenta"
        titulo="Tu cuenta está suspendida."
        subtitulo="Puedes consultar el motivo y solicitar una revisión."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start lg:gap-7">
        <section aria-label="Motivo de la suspensión" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-heading-lg font-semibold text-text">Pablo Ortega</h2>
              <p className="mt-4 text-body text-text-muted">Arrendador · Aguazul</p>
            </div>
            <span className="hidden md:inline-flex"><Badge tone="danger">Suspendido</Badge></span>
          </div>
          <Badge tone="danger" className="mt-5 md:hidden">Suspendido</Badge>

          <p className="mt-6 text-body font-semibold text-text-muted lg:mt-8">Motivo de la medida</p>
          <p className="mt-4 text-body text-text-muted lg:mt-5">
            Posible uso de fotografías ajenas en Cargador frontal; revisión de origen y consistencia pendiente.
          </p>
          <p className="mt-5 text-small text-text-muted">Referencia REP-108 · 18 oct. 2026</p>

          <InfoBox title="Una suspensión no es eliminación" className="mt-5">
            No puedes publicar, editar equipos ni valorar mientras la medida esté activa. Tus publicaciones no son visibles. Los datos se conservan para revisión.
          </InfoBox>
        </section>

        <section aria-labelledby="hay-error" className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          <h2 id="hay-error" className="text-heading-md font-semibold text-text md:text-heading-lg">¿Consideras que hay un error?</h2>
          <p className="mt-4 text-body text-text-muted ">
            Desde el Centro de ayuda, elige “Revisión de cuenta” e indica REP-108 y tu explicación. No envíes documentos ni datos de terceros.
          </p>
          <Button as="a" href="#ayuda" size="lg" fullWidth className="mt-5">Ayuda → Solicitar revisión de cuenta</Button>
          <p className="mt-4 text-small text-text-muted">
            La revisión no garantiza reactivación automática ni un plazo de respuesta. No necesitas contactar al denunciante.
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <Button as={Link} to="/normas" variant="secondary" size="lg">Leer normas de publicación</Button>
        <Button as={Link} to="/catalogo" variant="secondary" size="lg">Explorar sitio público</Button>
        <Button as={Link} to="/" variant="secondary" size="lg">Cerrar sesión</Button>
      </div>
    </PaginaCuenta>
  );
}
