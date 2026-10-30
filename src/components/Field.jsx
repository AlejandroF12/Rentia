import { EyeOff } from 'lucide-react';

/**
 * Campo de formulario con etiqueta, ayuda opcional e icono final opcional.
 * Usa defaultValue para mostrar los datos de ejemplo del diseño.
 */
export default function Field({ label, id, type = 'text', hint, trailingIcon: TrailingIcon, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-label font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-body text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-alpha-14"
          {...props}
        />
        {TrailingIcon && (
          <TrailingIcon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text"
          />
        )}
      </div>
      {hint && <p className="mt-2 text-small text-text-muted">{hint}</p>}
    </div>
  );
}

/** Campo de contraseña (el icono del ojo es solo visual por ahora). */
export function PasswordField({ hint, ...props }) {
  return <Field type="password" trailingIcon={EyeOff} hint={hint} {...props} />;
}
