import { Heart, MapPin, ArrowUpRight } from 'lucide-react';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import { EstadoBadge } from './Badge';
import { Puntaje } from './StarRating';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { setFavorite } from '../services/clientService';

/**
 * Tarjeta de equipo.
 * - favorito: muestra el corazón (catálogo). En el perfil público va en false.
 * - estadoEnCuerpo: en móvil el estado va debajo de la imagen (perfil público).
 */
export default function EquipoCard({ equipo, favorito = true, estadoEnCuerpo = false, isFavorite = false, onFavoriteChange }) {
  const { session, profile } = useAuth();
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');
  const [favoriteAnimation, setFavoriteAnimation] = useState(false);
  const [favoriteNotice, setFavoriteNotice] = useState('');
  const favorite = isFavorite;
  const { categoria, nombre, lugar, distancia, puntaje, disponible, imagen } = equipo;

  return (
    <article className="equipment-card motion-enter overflow-hidden rounded-2xl border border-border bg-surface">
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
        {favorito && profile?.role === 'cliente' && (
          <button
            type="button"
            aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            disabled={savingFavorite}
            onClick={async () => {
              if (!session?.user?.id) return;
              const nextValue = !favorite;
              setSavingFavorite(true);
              setFavoriteError('');
              try {
                await setFavorite(session.user.id, equipo.id, nextValue);
                onFavoriteChange?.(equipo.id, nextValue);
                setFavoriteNotice(nextValue ? 'Equipo guardado en favoritos.' : 'Equipo quitado de favoritos.');
                if (nextValue) {
                  setFavoriteAnimation(true);
                  window.setTimeout(() => setFavoriteAnimation(false), 700);
                }
              } catch (error) {
                setFavoriteError(error.message);
              } finally {
                setSavingFavorite(false);
              }
            }}
            aria-pressed={favorite}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface text-text shadow-sm"
          >
            <span className={`favorite-heart ${favoriteAnimation ? 'favorite-heart-pop' : ''}`}>
              <Heart size={17} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
            </span>
            <span aria-hidden="true" className={`favorite-burst ${favoriteAnimation ? 'favorite-burst-active' : ''}`}>
              <i /><i /><i /><i />
            </span>
          </button>
        )}
      </div>

      <div className="p-4 md:px-4 md:py-4">
        <span className="sr-only" role="status" aria-live="polite">{favoriteNotice}</span>
        {favoriteError && <p role="alert" className="mb-2 text-caption text-danger">{favoriteError}</p>}
        {estadoEnCuerpo && <EstadoBadge disponible={disponible} className="mb-3 md:hidden" />}
        <p className="text-caption font-medium uppercase tracking-wide text-text-muted">{categoria}</p>
        <h3 className="mt-2 text-heading-sm font-semibold text-text">{nombre}</h3>
        <div className="mt-2 flex min-w-0 items-center justify-between gap-3 text-small text-text-muted">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            <span className="truncate">{lugar}{distancia ? ` · ${distancia}` : ''}</span>
          </span>
          <Puntaje valor={puntaje} className="shrink-0" />
        </div>
        <Link to={`/detalle-equipo?id=${equipo.id}`} className="mt-3 flex items-center justify-between border-t border-border pt-3 text-label font-semibold text-text">
          Ver equipo
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
