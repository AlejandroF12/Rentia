const tones = {
  default: 'border-border bg-surface',
  muted: 'border-transparent bg-surface-muted',
  danger: 'border-danger-border bg-danger-subtle',
};

/** Tarjeta contenedora. tone: default | muted | danger. */
export default function Card({ as: Tag = 'section', tone = 'default', className = '', children, ...props }) {
  return (
    <Tag className={`rounded-2xl border p-5 md:p-6 ${tones[tone]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
