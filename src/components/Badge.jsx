const tones = {
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  neutral: 'bg-surface-muted text-text-muted',
};

/** Píldora con punto: "• Disponible", "• No disponible", "• Cliente"... */
export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-small font-medium ${tones[tone]} ${className}`}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function EstadoBadge({ disponible = true, className = '' }) {
  return (
    <Badge tone={disponible ? 'success' : 'warning'} className={className}>
      {disponible ? 'Disponible' : 'No disponible'}
    </Badge>
  );
}
