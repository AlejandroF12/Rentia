import { MapPin, Heart, Share2, Images, MessageCircle, Phone, ArrowUpRight, Flag } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { EstadoBadge } from '../components/Badge';
import InfoBox from '../components/InfoBox';
import MapaEstatico from '../components/MapaEstatico';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadEquipmentById } from '../services/equipmentService';

function TarjetaPropietario({ owner }) {
  const phone = owner?.phone || '';
  const phoneDigits = phone.replace(/\D/g, '');
  const ownerName = owner?.full_name || 'Propietario de Rentia';
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-caption font-medium uppercase tracking-wide text-text-muted">Habla con el propietario</p>

      <div className="mt-4 flex items-center gap-3">
        <Avatar className="size-12" />
        <div>
          <p className="text-body-lg font-semibold text-text">{ownerName}</p>
          <p className="text-small text-text-muted">Arrendador · {owner?.municipality || 'Casanare'}</p>
        </div>
      </div>

      <p className="mt-4 text-small text-text-muted">En Rentia desde marzo de 2024</p>

      <div className="mt-4 space-y-3">
        <Button as="a" href={phoneDigits ? `https://wa.me/${phoneDigits}` : '#'} target="_blank" rel="noreferrer" size="lg" fullWidth icon={MessageCircle} trailingIcon={ArrowUpRight} disabled={!phoneDigits}>
          Contactar por WhatsApp
        </Button>
        <Button as="a" href={phone ? `tel:${phone}` : '#'} variant="secondary" size="lg" fullWidth icon={Phone} trailingIcon={ArrowUpRight} disabled={!phone}>
          Llamar a {ownerName}
        </Button>
      </div>

      <p className="mt-4 text-center text-small text-text-muted">{phone || 'Teléfono no autorizado'}</p>

      <InfoBox icon={ArrowUpRight} className="mt-4">
        El contacto y la negociación son directos con el propietario, fuera de Rentia.
      </InfoBox>

      <a href="/perfil-publico" className="mt-4 inline-block text-small font-semibold text-text">Ver perfil y valoraciones →</a>

      <p className="mt-4 hidden items-center gap-1.5 text-caption text-text-muted lg:flex">
        <Flag size={10} aria-hidden="true" /> Reportar esta publicación
      </p>
    </div>
  );
}

export default function DetalleEquipoPage() {
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('id');
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const hasInvalidEquipmentId = Boolean(equipmentId && !uuidPattern.test(equipmentId));
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState(() => (
    !equipmentId
      ? 'No se indicó el equipo que deseas consultar.'
      : hasInvalidEquipmentId
        ? 'El enlace del equipo no es válido. Regresa al catálogo y selecciona una publicación.'
        : ''
  ));

  useEffect(() => {
    if (!equipmentId || hasInvalidEquipmentId) {
      return;
    }

    loadEquipmentById(equipmentId).then(setEquipment).catch((loadError) => setError(loadError.message));
  }, [equipmentId, hasInvalidEquipmentId]);

  if (!equipmentId) {
    return <main className="mx-auto max-w-[1440px] px-5 py-16 text-danger">No se indicó el equipo que deseas consultar.</main>;
  }
  if (error) {
    return <main className="mx-auto max-w-[1440px] px-5 py-16 text-danger">{error}</main>;
  }
  if (!equipment) {
    return <main className="mx-auto max-w-[1440px] px-5 py-16 text-text-muted">Cargando equipo...</main>;
  }

  const owner = equipment.owner;
  const fichaReal = [
    ['Marca', equipment.brand || 'No especificada'],
    ['Modelo', equipment.model || equipment.model_year || 'No especificado'],
    ['Característica', equipment.main_feature || 'Consultar con el propietario'],
  ];

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
          <p className="text-caption font-medium uppercase tracking-wide text-text-muted">{equipment.category}</p>
          <EstadoBadge disponible={equipment.is_available} />
        </div>
        <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">{equipment.name}</h1>
        <div className="mt-3 flex flex-col gap-1 text-label text-text-muted md:flex-row md:items-center md:gap-6">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> {equipment.municipality}</span>
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
            <TarjetaPropietario owner={owner} />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <h2 className="text-heading-md font-semibold text-text md:text-heading-lg">{equipment.name}</h2>
                <p className="mt-3 text-body-lg text-text-muted">{equipment.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {fichaReal.map(([etiqueta, valor]) => (
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
              <h2 className="text-heading-md font-semibold text-text">Valoraciones</h2>
            </div>
            <InfoBox className="mt-5">
              Este equipo todavía no tiene valoraciones publicadas.
            </InfoBox>

            <p className="mt-6 flex items-center gap-1.5 text-caption text-text-muted lg:hidden">
              <Flag size={10} aria-hidden="true" /> Reportar esta publicación
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
