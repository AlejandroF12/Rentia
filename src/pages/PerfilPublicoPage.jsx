import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Eyebrow from '../components/Eyebrow';
import InfoBox from '../components/InfoBox';

export default function PerfilPublicoPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        <a href="/detalle-equipo" className="text-small text-text-muted">← Volver al detalle de CAT 420F</a>

        <Eyebrow className="mt-5">Perfil público / Arrendador</Eyebrow>
        <h1 className="mt-2 max-w-[18ch] text-title-mobile font-semibold text-text md:max-w-none md:text-title-desktop">
          Gente de aquí. Confianza que cuenta.
        </h1>
        <p className="mt-2 text-body-lg text-text-muted">Conoce al propietario y las experiencias de la comunidad.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Tarjeta del arrendador */}
          <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-14" />
              <div>
                <p className="text-body-lg font-semibold text-text">Carlos Rojas</p>
                <p className="text-small text-text-muted">Arrendador · Yopal, Casanare</p>
              </div>
            </div>

            <p className="mt-5 text-small text-text-muted">En Rentia desde marzo de 2024</p>

            <p className="mt-4 text-small text-text-muted">Aún no hay valoraciones publicadas.</p>

            <p className="mt-4 text-label text-text-muted">
              Maquinaria para proyectos en Yopal y municipios cercanos. Consulta directamente la operación y el traslado.
            </p>

            <div className="mt-5 space-y-3">
              <Button as="a" href="https://wa.me/573104567820" target="_blank" rel="noreferrer" size="lg" fullWidth icon={MessageCircle} trailingIcon={ArrowUpRight}>
                Contactar por WhatsApp
              </Button>
              <Button as="a" href="tel:+573104567820" variant="secondary" size="lg" fullWidth icon={Phone} trailingIcon={ArrowUpRight}>
                Llamar a Carlos
              </Button>
            </div>

            <InfoBox title="Contacto directo" className="mt-4">
              La negociación ocurre fuera de Rentia. La reputación recoge experiencias de contacto, no acredita alquileres realizados.
            </InfoBox>
          </aside>

          <div className="min-w-0">
            {/* Equipos */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Equipos de Carlos</h2>
              <p className="text-small text-text-muted">Sin publicaciones cargadas</p>
            </div>
            <InfoBox className="mt-4">Las publicaciones del arrendador aparecerán aquí cuando se conecte su perfil real.</InfoBox>

            {/* Opiniones */}
            <h2 className="mt-10 text-heading-md font-semibold text-text md:text-heading-lg">Opiniones de la comunidad</h2>
            <InfoBox className="mt-4">Aún no hay opiniones publicadas para este perfil.</InfoBox>
          </div>
        </div>
      </main>
    </div>
  );
}
