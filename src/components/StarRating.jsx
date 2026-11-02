import { Star } from 'lucide-react';

/** Muestra una puntuación y puede convertirse en selector interactivo. */
export default function StarRating({ size = 16, className = '', value = 5, onChange, disabled = false }) {
  const roundedValue = Math.round(value);
  const interactive = typeof onChange === 'function';
  return (
    <div className={`flex gap-0.5 text-accent ${className}`} role={interactive ? 'radiogroup' : undefined} aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        interactive ? (
          <button
            key={i}
            type="button"
            role="radio"
            aria-label={`${i + 1} ${i === 0 ? 'estrella' : 'estrellas'}`}
            aria-checked={i + 1 === value}
            disabled={disabled}
            onClick={() => onChange(i + 1)}
            className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed"
          >
            <Star size={size} fill={i < roundedValue ? 'currentColor' : 'none'} strokeWidth={i < roundedValue ? 0 : 1.5} aria-hidden="true" />
          </button>
        ) : (
          <Star key={i} size={size} fill={i < roundedValue ? 'currentColor' : 'none'} strokeWidth={i < roundedValue ? 0 : 1.5} aria-hidden="true" />
        )
      ))}
    </div>
  );
}

/** "★ 4,9" en línea */
export function Puntaje({ valor, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-small text-text ${className}`}>
      <Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      {valor}
    </span>
  );
}
