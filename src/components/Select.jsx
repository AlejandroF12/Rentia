import { ChevronDown } from 'lucide-react';

/**
 * Lista desplegable nativa con la misma estética que Field.
 * error: texto del mensaje; activa el borde de error.
 * Usa defaultValue para el dato de ejemplo (value="" = placeholder).
 */
export default function Select({ label, id, hint, error, className = '', children, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full appearance-none rounded-lg border bg-surface pl-4 pr-11 text-body text-text focus:outline-none focus:ring-2 focus:ring-primary-alpha-14 ${
            error ? 'border-danger' : 'border-border focus:border-primary'
          }`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-small text-danger">
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-2 text-small text-text-muted">{hint}</p>}
    </div>
  );
}
