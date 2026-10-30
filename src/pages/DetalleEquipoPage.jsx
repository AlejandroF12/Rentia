import { MapPin, Star, Heart, Share2, Images, MessageCircle, Phone, ArrowUpRight, Flag } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { EstadoBadge } from '../components/Badge';
import StarRating from '../components/StarRating';
import InfoBox from '../components/InfoBox';
import MapaEstatico from '../components/MapaEstatico';

const ficha = [
  ['Marca', 'Caterpillar'],
  ['Modelo', '420F · 2018'],
  ['Potencia', '93 HP'],
  ['Tracción', '4 × 4'],
  ['Peso operativo', '8,4 toneladas'],
  ['Operador', 'Consultar con Carlos'],
];

function TarjetaPropietario() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-caption font-medium uppercase tracking-wide text-text-muted">Habla con el propietario</p>

      <div className="mt-4 flex items-center gap-3">
        <Avatar className="size-12" />
        <div>
          <p className="text-body-lg font-semibold text-text">Carlos Rojas</p>
          <p className="text-small text-text-muted">Arrendador · Yopal</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-small text-text">
            <Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" /> 4,9 · 24 valoraciones
          </p>
        </div>
      </div>

      <p className="mt-4 text-small text-text-muted">En Rentia desde marzo de 2024</p>

      <div className="mt-4 space-y-3">
        <Button as="a" href="https://wa.me/573104567820" target="_blank" rel="noreferrer" size="lg" fullWidth icon={MessageCircle} trailingIcon={ArrowUpRight}>
          Contactar por WhatsApp
        </Button>
        <Button as="a" href="tel:+573104567820" variant="secondary" size="lg" fullWidth icon={Phone} trailingIcon={ArrowUpRight}>
          Llamar a Carlos
        </Button>
      </div>

      <p className="mt-4 text-center text-small text-text-muted">+57 310 456 7820</p>

      <InfoBox icon={ArrowUpRight} className="mt-4">
        El contacto y la negociación son directos con Carlos, fuera de Rentia.
      </InfoBox>

      <a href="/perfil-publico" className="mt-4 inline-block text-small font-semibold text-text">Ver perfil y valoraciones →</a>

      <p className="mt-4 hidden items-center gap-1.5 text-caption text-text-muted lg:flex">
        <Flag size={10} aria-hidden="true" /> Reportar esta publicación
      </p>
    </div>
  );
}

export default function DetalleEquipoPage() {
  return (
    <div className="min-h-screen bg-surface font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        {/* Migas + acciones */}
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <span className="lg:hidden">← Volver al catálogo</span>
            <span className="hidden lg:inline">Inicio / Explorar equipos / Retroexcavadora CAT 420F</span>
          </Breadcrumb>
          <div className="flex items-center gap-4 text-text">
            <button type="button" aria-label="Guardar en favoritos"><Heart size={18} /></button>
            <button type="button" aria-label="Compartir"><Share2 size={18} /></button>
          </div>
        </div>

        {/* Encabezado */}
        <div className="mt-5 flex items-center gap-3">
          <p className="text-caption font-medium uppercase tracking-wide text-text-muted">Movimiento de tierra</p>
          <EstadoBadge disponible />
        </div>
        <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">Retroexcavadora CAT 420F</h1>
        <div className="mt-3 flex flex-col gap-1 text-label text-text-muted md:flex-row md:items-center md:gap-6">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> Yopal, Casanare · a 5 km</span>
          <span className="inline-flex items-center gap-1.5"><Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" /> 4,9 · 24 valoraciones del arrendador</span>
        </div>

        {/* Galería */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:h-[360px] lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
          <ImagenNoEncontrada className="col-span-2 aspect-[4/3] w-full rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full" />
          <ImagenNoEncontrada className="h-28 w-full rounded-2xl lg:h-full" />
          <div className="relative h-28 lg:h-full">
            <ImagenNoEncontrada className="size-full rounded-2xl" />
            <button type="button" className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-small font-semibold text-text">
              <Images size={14} aria-hidden="true" />
              <span className="lg:hidden">Ver 6 fotos</span>
              <span className="hidden lg:inline">Ver las 6 fotos</span>
            </button>
          </div>
        </div>

        {/* Contenido + propietario */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          <aside className="lg:col-start-2 lg:row-start-1">
            <TarjetaPropietario />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">Lista para tu próximo proyecto.</h2>
            <p className="mt-3 text-body-lg text-text-muted">
              Retroexcavadora en excelente estado para excavación, movimiento de tierra y adecuación de terrenos.
              Disponible en Yopal y municipios cercanos. Consulta con Carlos las condiciones de operación y traslado.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {ficha.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="rounded-lg bg-background p-4">
                  <dt className="text-small text-text-muted">{etiqueta}</dt>
                  <dd className="mt-1 text-label font-semibold text-text">{valor}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 text-heading-md font-semibold text-text">Cerca de ti</h2>
            <p className="mt-1 text-small text-text-muted">Sector El Morro · Yopal, Casanare</p>
            <MapaEstatico className="mt-4 h-48" />
            <p className="mt-3 text-caption text-text-muted">
              La ubicación es aproximada y solo sirve para encontrar equipos cercanos. Confirma el punto exacto con el propietario.
            </p>

            <hr className="my-8 border-border" />

            <div className="flex items-center justify-between">
              <h2 className="text-heading-md font-semibold text-text">Gente que recomienda</h2>
              <a href="/perfil-publico" className="hidden text-small text-text-muted lg:block">Ver las 24 opiniones →</a>
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10" />
                <div>
                  <p className="text-label font-semibold text-text">María López · Cliente</p>
                  <p className="text-caption text-text-muted">Calificó a Carlos Rojas · 12 oct. 2026</p>
                </div>
              </div>
              <StarRating size={12} />
            </div>
            <p className="mt-4 text-label text-text-muted">
              “Carlos respondió con claridad y el equipo estaba en muy buenas condiciones. Excelente atención para nuestro proyecto en Yopal.”
            </p>
            <a href="/perfil-publico" className="mt-4 inline-block text-label font-semibold text-text">¿Ya contactaste a Carlos? Calificar arrendador →</a>

            <p className="mt-6 flex items-center gap-1.5 text-caption text-text-muted lg:hidden">
              <Flag size={10} aria-hidden="true" /> Reportar esta publicación
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
