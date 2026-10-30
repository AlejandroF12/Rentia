import { Check } from 'lucide-react';

/** Etiqueta de valoración ("Buena atención"). Escritorio: con check; móvil: con punto. */
export default function Chip({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg bg-success-subtle px-3 py-1.5 text-small font-medium text-success ${className}`}>
      <Check size={12} aria-hidden="true" className="hidden md:block" />
      <span aria-hidden="true" className="size-1 rounded-full bg-current md:hidden" />
      {children}
    </span>
  );
}
