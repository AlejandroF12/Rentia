import { Link } from 'react-router-dom';
import { Ban, CircleAlert, Info, Trash2 } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Checkbox from '../components/Checkbox';
import Field from '../components/Field';
import InfoBox from '../components/InfoBox';
import OpcionSeleccionable from '../components/OpcionSeleccionable';
import Textarea from '../components/Textarea';
import TileEquipo from '../components/TileEquipo';

const TITULO_SECCION = 'text-heading-md font-semibold text-text';

export default function ModeracionMotivoPage() {
  return (
    <PaginaCuenta rol="admin" ancho="estrecho">
      <PageHeader
        volver={{ to: '/admin/reportes', texto: 'Volver al reporte REP-108' }}
        eyebrow="Administración / REP-108"
        titulo="Una decisión clara y registrada."
        subtitulo="Revisa el objetivo, documenta el motivo y confirma el alcance de la acción."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
        <div className="space-y-6">
          <TileEquipo nombre="Cargador frontal" detalle="Pablo Ortega · Aguazul" />

          <form className="rounded-2xl border border-border bg-surface p-5 md:p-6" aria-label="Decisión de moderación">
            <fieldset>
              <legend className={TITULO_SECCION}>1. ¿Sobre qué actuarás?</legend>
              <div className="mt-4 space-y-3">
                <OpcionSeleccionable
                  id="objetivo-publicacion"
                  name="objetivo"
                  titulo="Publicación: Cargador frontal"
                  descripcion="Solo afecta esta ficha del catálogo."
                />
                <OpcionSeleccionable
                  id="objetivo-usuario"
                  name="objetivo"
                  defaultChecked
                  titulo="Usuario: Pablo Ortega"
                  descripcion="Arrendador · Aguazul. Afecta su acceso a la cuenta y oculta sus publicaciones mientras esté suspendido."
                />
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className={TITULO_SECCION}>2. Elige la medida</legend>
              <div className="mt-4 space-y-3">
                <OpcionSeleccionable
                  id="medida-suspender"
                  name="medida"
                  defaultChecked
                  titulo="Suspender usuario"
                  descripcion="Restringe su acceso temporalmente. Puede levantarse después de una revisión."
                />
                <OpcionSeleccionable
                  id="medida-eliminar"
                  name="medida"
                  peligro
                  titulo="Eliminar usuario permanentemente"
                  descripcion="Retira el perfil de forma irreversible. Exige escribir ELIMINAR y confirmar de nuevo antes de ejecutarse."
                />
              </div>
            </fieldset>

            <Textarea
              id="motivo"
              label="Motivo obligatorio *"
              rows={3}
              className="mt-6"
              defaultValue="Posible uso de fotografías ajenas en Cargador frontal; revisión de origen y consistencia pendiente. Referencia REP-108."
              hint="El motivo se mostrará a la persona afectada y quedará en el registro de moderación."
            />

            <h2 className={`mt-6 ${TITULO_SECCION}`}>3. Confirma el alcance</h2>
            <InfoBox tone="warning" icon={CircleAlert} title="Vas a suspender a Pablo Ortega" className="mt-4">
              Se restringirá el acceso y se ocultarán sus publicaciones. No se eliminarán permanentemente sus datos ni se resolverá automáticamente REP-108.
            </InfoBox>
            <Checkbox id="confirmo-revision" defaultChecked className="mt-4 text-text-muted">
              Confirmo que revisé REP-108 y que la medida seleccionada es SUSPENDER USUARIO a Pablo Ortega.
            </Checkbox>

            <div className="mt-4 flex flex-col gap-3">
              <Button as={Link} to="/admin/reportes" variant="secondary" size="lg" fullWidth>
                Cancelar y volver al reporte
              </Button>
              <Button type="button" size="lg" fullWidth icon={Ban}>
                Confirmar suspensión de usuario
              </Button>
            </div>
          </form>

          <section aria-labelledby="confirmacion-eliminacion" className="rounded-2xl bg-surface-muted p-5 md:p-6">
            <h2 id="confirmacion-eliminacion" className="text-heading-md font-semibold text-text md:text-heading-lg">
              Confirmación para eliminación
            </h2>
            <p className="mt-3 text-small text-text-muted">
              Solo si eliges “Eliminar usuario permanentemente”. No se ejecuta al confirmar una suspensión.
            </p>
            <Field
              id="confirmar-eliminar"
              label="Escribe ELIMINAR para habilitar la acción"
              placeholder="Escribir confirmación"
              className="mt-5"
            />
            <Checkbox id="entiendo-irreversible" className="mt-4">
              Entiendo que eliminar el perfil de Pablo Ortega es irreversible.
            </Checkbox>
            <Button type="button" variant="danger" size="lg" fullWidth icon={Trash2} disabled className="mt-4">
              Eliminar usuario definitivamente
            </Button>
            <p className="mt-3 text-small text-text-muted">
              Acción deshabilitada hasta seleccionar eliminación, escribir ELIMINAR y marcar la confirmación.
            </p>
          </section>

          <InfoBox tone="success" title="Resultado de la suspensión: acción registrada">
            Pablo Ortega · Suspendido. Motivo guardado por Andrea Pérez · 18 oct. 2026, 10:20 · REP-108 sigue en revisión.
          </InfoBox>

          <Button as={Link} to="/admin/reportes" variant="secondary" size="lg" fullWidth>
            Ver registro de moderación
          </Button>
        </div>

        {/* Contexto (solo escritorio) */}
        <aside className="hidden space-y-5 lg:block">
          <section className="rounded-2xl bg-surface-muted p-6">
            <h2 className="text-heading-md font-semibold text-text">Contexto del reporte</h2>
            <TileEquipo nombre="Cargador frontal" detalle="Pablo Ortega · Aguazul" className="mt-5 bg-transparent p-0" iconoClassName="size-9" />
            <Badge tone="warning" className="mt-5">En revisión</Badge>
            <p className="mt-4 text-body text-text-muted">
              Posible uso de fotografías ajenas. Evalúa el contenido antes de elegir una medida; el reporte por sí solo no demuestra un incumplimiento.
            </p>
            <p className="mt-5 text-small text-text-muted">Responsable del caso: Andrea Pérez</p>
            <Button as={Link} to="/admin/reportes" variant="secondary" size="lg" fullWidth className="mt-4">
              Ver reporte completo
            </Button>
          </section>
          <InfoBox icon={Info} title="Sin medidas automáticas">
            Suspender una publicación no suspende la cuenta. Cada objetivo requiere su propia decisión y confirmación.
          </InfoBox>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
