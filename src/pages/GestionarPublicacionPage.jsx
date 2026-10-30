import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye, EyeOff, Trash2 } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Badge, { EstadoBadge } from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import ConfirmarEliminacion from '../components/ConfirmarEliminacion';
import { Puntaje } from '../components/StarRating';

/**
 * Gestionar publicación.
 * Estado inicial por defecto. Los bloques de los siguientes estados ya están
 * construidos y se activan con estas props (cuando haya estado, vendrán de useState):
 *  - ocultada: muestra "Resultado: publicación oculta" y el botón "Volver a publicar".
 *  - confirmandoEliminacion: muestra el bloque "¿Eliminar CAT 420F definitivamente?".
 *  - eliminada: dentro de ese bloque, muestra el resultado de eliminar.
 */
export default function GestionarPublicacionPage({ ocultada = false, confirmandoEliminacion = false, eliminada = false }) {
  const equipo = (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <ImagenNoEncontrada className="aspect-[16/7] w-full md:aspect-[16/9]" />
      <div className="p-4">
        <EstadoBadge disponible />
        <p className="mt-3 text-caption uppercase tracking-wide text-text-muted">Movimiento de tierra</p>
        <h3 className="mt-2 text-heading-sm font-semibold text-text">Retroexcavadora CAT 420F</h3>
        <div className="mt-2 flex items-center justify-between text-small text-text-muted">
          <span>Yopal · 5 km</span>
          <Puntaje valor="4,9" />
        </div>
        <Link to="/detalle-equipo" className="mt-3 flex items-center justify-between border-t border-border pt-3 text-label font-semibold text-text">
          Ver equipo <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );

  return (
    <PaginaCuenta rol="arrendador">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Mis equipos / CAT 420F"
        titulo="Tú decides cuándo mostrarlo."
        subtitulo="Gestiona la visibilidad sin confundirla con la disponibilidad."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        {/* Ficha del equipo: en móvil va arriba, en escritorio a la derecha */}
        <div className="lg:hidden">{equipo}</div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">Visibilidad actual</h2>
            <Badge tone="success" className="mt-4">Publicada · Disponible</Badge>
            <p className="mt-4 text-body text-text-muted">Retroexcavadora CAT 420F · Yopal, Casanare</p>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary bg-surface-muted p-4">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-primary" aria-hidden="true">
                <span className="size-2 rounded-full bg-primary" />
              </span>
              <div>
                <p className="text-label font-semibold text-text">Dejar de publicar</p>
                <p className="mt-1 text-small text-text-muted">Oculta la ficha del catálogo. Guarda fotos y datos para volver a publicarla cuando quieras.</p>
              </div>
            </div>

            <Button type="button" size="lg" icon={EyeOff} fullWidth className="mt-4">Dejar de publicar</Button>

            {ocultada && (
              <div className="mt-4 space-y-4">
                <InfoBox tone="success" title="Resultado: publicación oculta">
                  CAT 420F ya no se muestra en el catálogo. Puedes volver a publicarla desde Mis equipos.
                </InfoBox>
                <Button type="button" variant="secondary" size="lg" icon={Eye} fullWidth>Volver a publicar</Button>
                <p className="text-small text-text-muted">Volver a publicar restaura la visibilidad, no cambia por sí solo el estado de disponibilidad.</p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">¿Solo no está disponible?</h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">
              Mantén la publicación visible y marca “No disponible” desde Editar vehículo. No crea una reserva ni un calendario.
            </p>
            <Button as={Link} to="/arrendador/equipos/editar" variant="secondary" size="lg" fullWidth className="mt-5">
              Editar disponibilidad
            </Button>
          </Card>

          <Card tone="danger">
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">Eliminar permanentemente</h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">Úsalo solo si no quieres conservar esta publicación. No se puede deshacer.</p>
            <div className="mt-5 flex justify-center">
              <Link to="/arrendador/equipos/eliminar" className="inline-flex items-center gap-2 py-2 text-label font-semibold text-danger">
                <Trash2 size={14} aria-hidden="true" /> Eliminar publicación…
              </Link>
            </div>
            <p className="mt-4 text-small text-text-muted">Se solicitará una confirmación intencional antes de eliminar.</p>
          </Card>

          {confirmandoEliminacion && <ConfirmarEliminacion resultado={eliminada} />}

          <InfoBox title="Conserva el control" className="lg:hidden">
            Despublicar se puede revertir. Eliminar es definitivo; revisa la confirmación antes de continuar.
          </InfoBox>
        </div>

        <aside className="hidden space-y-4 lg:block">
          {equipo}
          <Card tone="muted">
            <h2 className="text-heading-md font-semibold text-text">Tres estados distintos</h2>
            <dl className="mt-5 space-y-5 text-small text-text-muted">
              <div>
                <dt className="text-label font-semibold">No disponible</dt>
                <dd className="mt-1">La ficha sigue visible, pero el equipo no está disponible según su propietario.</dd>
              </div>
              <div>
                <dt className="text-label font-semibold">Sin publicar</dt>
                <dd className="mt-1">La ficha está oculta. Conservas fotos y datos y puedes volver a publicarla.</dd>
              </div>
              <div>
                <dt className="text-label font-semibold">Eliminada</dt>
                <dd className="mt-1">La ficha se retira de forma permanente y no puede recuperarse.</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
