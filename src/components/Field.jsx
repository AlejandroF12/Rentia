import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Campo de formulario con etiqueta, ayuda opcional e icono final opcional.
 * Usa defaultValue para mostrar los datos de ejemplo del diseño.
 * error: texto del mensaje; activa el borde de error (opcional).
 */
export default function Field({
  label,
  id,
  type = 'text',
  hint,
  error,
  trailingIcon: TrailingIcon,
  trailingAction,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-lg border bg-surface px-4 pr-12 text-body text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-alpha-14 ${
            error ? 'border-danger' : 'border-border focus:border-primary'
          }`}
          {...props}
        />
        {trailingAction || TrailingIcon ? (
          trailingAction || (
          <TrailingIcon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text"
          />
          )
        ) : null}
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

export function PasswordField({ hint, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      type={visible ? 'text' : 'password'}
      hint={hint}
      {...props}
      trailingAction={
        <button
          type="button"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      }
    />
  );
}
