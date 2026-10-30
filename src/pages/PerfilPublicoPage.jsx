import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Eyebrow from '../components/Eyebrow';
import InfoBox from '../components/InfoBox';
import StarRating from '../components/StarRating';
import EquipoCard from '../components/EquipoCard';
import { equipos, opiniones } from '../data/muestra';

const equiposDeCarlos = [equipos[0], { ...equipos[4], nombre: 'Volqueta doble troque' }];

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

            <p className="mt-4 flex items-baseline gap-2">
              <span className="text-title-desktop font-semibold text-text">4,9</span>
              <span className="text-small text-text-muted">/ 5 · 24 opiniones</span>
            </p>
            <StarRating size={22} className="mt-2" />

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

            <p className="mt-4 text-caption text-text-muted">+57 310 456 7820 · Contacto autorizado</p>

            <InfoBox title="Contacto directo" className="mt-4">
              La negociación ocurre fuera de Rentia. La reputación recoge experiencias de contacto, no acredita alquileres realizados.
            </InfoBox>
          </aside>

          <div className="min-w-0">
            {/* Equipos */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Equipos de Carlos</h2>
              <p className="text-small text-text-muted">2 publicaciones visibles</p>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {equiposDeCarlos.map((equipo) => (
                <EquipoCard key={equipo.id} equipo={equipo} favorito={false} estadoEnCuerpo />
              ))}
            </div>

            {/* Opiniones */}
            <h2 className="mt-10 text-heading-md font-semibold text-text md:text-heading-lg">24 opiniones de la comunidad</h2>
            <p className="mt-2 text-small text-text-muted">Más recientes ↓ · Experiencias de contacto</p>

            <div className="mt-4 space-y-4">
              {opiniones.map((o) => (
                <article key={o.id} className="rounded-2xl border border-border bg-surface p-5 md:p-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <p className="text-label font-medium text-text-muted">Opinión de {o.autor} · {o.fecha}</p>
                    <StarRating size={16} className="md:order-last" />
                  </div>
                  <p className="mt-4 text-label text-text-muted md:text-body">“{o.texto}”</p>
                  <Button variant="secondary" size="md" fullWidth className="mt-5 md:w-auto">Reportar opinión</Button>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button variant="secondary" size="lg">Ver más opiniones</Button>
              <Button size="lg">¿Ya tuviste contacto? Valorar a Carlos</Button>
            </div>
            <p className="mt-4 text-caption text-text-muted">
              Antes de continuar deberás declarar contacto directo previo. Solo una valoración por contraparte, editable.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
