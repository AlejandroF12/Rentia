import { ArrowUpRight, Tractor } from 'lucide-react';

/**
 * Recuadro con el equipo involucrado (reportes, moderación).
 * externo: muestra la flecha ↗  ·  iconoClassName: fondo opcional del icono (p. ej. "lg:bg-surface-selected").
 */
export default function TileEquipo({ nombre, detalle, externo = false, iconoClassName = '', className = '' }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-surface-muted p-4 ${className}`}>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-text ${iconoClassName}`}>
        <Tractor size={22} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-text md:text-body-lg">{nombre}</p>
        <p className="mt-0.5 text-small text-text-muted">{detalle}</p>
      </div>
      {externo && <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-text-muted" />}
    </div>
  );
}
