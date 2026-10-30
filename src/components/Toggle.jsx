/**
 * Interruptor (disponibilidad, etc.).
 * Por ahora es visual: `checked` define cómo se ve. Cuando haya estado,
 * pásale `onChange` y controla `checked` desde el padre.
 */
export default function Toggle({ checked = false, label, onChange, className = '', ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-success' : 'bg-border'} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0.5 size-4 rounded-full bg-surface transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  );
}
