/** Área de texto con la misma estética que Field. */
export default function Textarea({ label, id, hint, error, rows = 4, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-label font-semibold text-text">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full resize-none rounded-lg border bg-surface px-4 py-3 text-body text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-alpha-14 ${
          error ? 'border-danger' : 'border-border focus:border-primary'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-small text-danger">
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-2 text-small text-text-muted">{hint}</p>}
    </div>
  );
}
