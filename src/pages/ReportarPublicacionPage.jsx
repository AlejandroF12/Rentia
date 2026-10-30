import { Link } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';
import OpcionSeleccionable from '../components/OpcionSeleccionable';
import Textarea from '../components/Textarea';
import TileEquipo from '../components/TileEquipo';

const MOTIVOS = [
  { id: 'engañosa', titulo: 'Información engañosa' },
  { id: 'fotos', titulo: 'Fotos que no pertenecen al vehículo', marcado: true },
  { id: 'duplicada', titulo: 'Publicación duplicada' },
  { id: 'inapropiado', titulo: 'Contenido inapropiado' },
  { id: 'otro', titulo: 'Otro' },
];

export default function ReportarPublicacionPage() {
  return (
    <PaginaCuenta rol="cliente" ancho="estrecho">
      <PageHeader
        volver={{ to: '/detalle-equipo', texto: 'Volver a la publicación' }}
        eyebrow="Reporte de publicación"
        titulo="Ayúdanos a cuidar la comunidad."
        subtitulo="Cuéntanos qué ocurre con esta publicación."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
        <div>
          <TileEquipo nombre="Cargador frontal" detalle="Pablo Ortega · Aguazul" />

          <form className="mt-6 rounded-2xl border border-border bg-surface p-5 md:p-6" aria-label="Reportar publicación">
            <fieldset>
              <legend className="text-heading-lg font-semibold text-text">¿Cuál es el motivo? *</legend>
              <div className="mt-5 space-y-3">
                {MOTIVOS.map(({ id, titulo, marcado }) => (
                  <OpcionSeleccionable
                    key={id}
                    id={`motivo-${id}`}
                    name="motivo"
                    titulo={titulo}
                    defaultChecked={marcado}
                    className="items-center py-3.5"
                  />
                ))}
              </div>
            </fieldset>

            <Textarea
              id="explicacion"
              label="Explicación (opcional)"
              rows={3}
              maxLength={500}
              className="mt-6"
              defaultValue="Las fotografías parecen corresponder a otro equipo publicado. No coinciden con la descripción ni con la ubicación indicada."
              hint="Máximo 500 caracteres. No incluyas información de terceros."
            />

            <InfoBox title="Tu reporte es privado" className="mt-5">
              Lo revisará administración. No se publica tu identidad ni se informa al propietario quién reportó.
            </InfoBox>

            <div className="mt-5 flex flex-col gap-3">
              <Button as={Link} to="/reporte-enviado" size="lg" fullWidth icon={Flag}>Enviar reporte</Button>
              <Button as={Link} to="/detalle-equipo" variant="secondary" size="lg" fullWidth>Cancelar</Button>
            </div>
          </form>

          <p className="mt-6 text-small text-text-muted">
            Reportar de buena fe ayuda a mantener publicaciones claras y respetuosas. No implica que la irregularidad ya esté comprobada.
          </p>
        </div>

        <aside className="hidden space-y-5 lg:block">
          <section className="rounded-2xl bg-surface-muted p-6">
            <h2 className="text-heading-md font-semibold text-text">Revisión privada</h2>
            <p className="mt-5 text-body text-text-muted">
              El reporte y tu explicación solo se comparten con administración, no con el propietario ni en el catálogo.
            </p>
            <p className="mt-5 text-body text-text-muted">
              Reportar no retira automáticamente una publicación. Moderación revisará el caso antes de decidir.
            </p>
          </section>
          <InfoBox title="Solo lo necesario">
            Describe el problema sin datos personales. No se solicitan archivos ni documentos.
          </InfoBox>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
