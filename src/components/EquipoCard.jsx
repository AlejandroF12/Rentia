import { Heart, MapPin, ArrowUpRight } from 'lucide-react';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import { EstadoBadge } from './Badge';
import { Puntaje } from './StarRating';
import { Link } from 'react-router-dom';

/**
 * Tarjeta de equipo.
 * - favorito: muestra el corazón (catálogo). En el perfil público va en false.
 * - estadoEnCuerpo: en móvil el estado va debajo de la imagen (perfil público).
 */
export default function EquipoCard({ equipo, favorito = true, estadoEnCuerpo = false }) {
  const { categoria, nombre, lugar, distancia, puntaje, disponible, imagen } = equipo;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative">
        {imagen ? (
          <img src={imagen} alt={nombre} className="aspect-[16/10] w-full object-cover md:aspect-[16/9]" />
        ) : (
          <ImagenNoEncontrada className="aspect-[16/10] w-full md:aspect-[16/9]" />
        )}
        <EstadoBadge
          disponible={disponible}
          className={`absolute left-3 top-3 ${estadoEnCuerpo ? 'hidden md:inline-flex' : ''}`}
        />
        {favorito && (
          <button
            type="button"
            aria-label="Guardar en favoritos"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-surface text-text"
          >
            <Heart size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="p-4 md:px-4 md:py-4">
        {estadoEnCuerpo && <EstadoBadge disponible={disponible} className="mb-3 md:hidden" />}
        <p className="text-caption font-medium uppercase tracking-wide text-text-muted">{categoria}</p>
        <h3 className="mt-2 text-heading-sm font-semibold text-text">{nombre}</h3>
        <div className="mt-2 flex items-center justify-between text-small text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            {lugar} · {distancia}
          </span>
          <Puntaje valor={puntaje} />
        </div>
        <Link to="/detalle-equipo" className="mt-3 flex items-center justify-between border-t border-border pt-3 text-label font-semibold text-text">
          Ver equipo
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
