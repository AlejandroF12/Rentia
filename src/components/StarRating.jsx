import { Star } from 'lucide-react';

/** Cinco estrellas llenas (valor visual fijo por ahora). */
export default function StarRating({ size = 16, className = '' }) {
  return (
    <div className={`flex gap-0.5 text-accent ${className}`} aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill="currentColor" strokeWidth={0} aria-hidden="true" />
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
