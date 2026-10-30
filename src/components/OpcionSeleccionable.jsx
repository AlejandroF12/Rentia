/**
 * Opción en tarjeta con círculo de selección (radio o casilla).
 * Usa el control nativo: el aspecto "seleccionado" sale del estado :checked,
 * por eso no necesita estado de React. Usa defaultChecked para el ejemplo del diseño.
 * peligro: título en color de error (acciones destructivas).
 */
export default function OpcionSeleccionable({
  type = 'radio',
  id,
  name,
  titulo,
  descripcion,
  peligro = false,
  className = '',
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 has-checked:border-primary has-checked:bg-surface-muted has-focus-visible:ring-2 has-focus-visible:ring-primary-alpha-22 ${className}`}
    >
      <input id={id} type={type} name={name} className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-border bg-surface after:size-1.5 after:rounded-full after:bg-primary-foreground after:opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:after:opacity-100"
      />
      <span className="min-w-0">
        <span className={`block text-label font-semibold ${peligro ? 'text-danger' : 'text-text'}`}>{titulo}</span>
        {descripcion && <span className="mt-1 block text-small text-text-muted">{descripcion}</span>}
      </span>
    </label>
  );
}
