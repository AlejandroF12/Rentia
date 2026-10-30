import { Info, CircleCheck, CircleAlert } from 'lucide-react';

const tones = {
  neutral: { box: 'bg-surface-muted', text: 'text-text', icon: Info },
  success: { box: 'bg-success-subtle', text: 'text-success', icon: CircleCheck },
  danger: { box: 'bg-danger-subtle', text: 'text-danger', icon: CircleAlert },
};

/** Aviso con icono, título y texto (privacidad, éxito, error). */
export default function InfoBox({ tone = 'neutral', icon, title, children, className = '' }) {
  const { box, text, icon: DefaultIcon } = tones[tone];
  const Icon = icon ?? DefaultIcon;
  return (
    <div className={`flex gap-3 rounded-xl p-4 ${box} ${text} ${className}`}>
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="text-label font-semibold">{title}</p>}
        <p className={`text-small ${title ? 'mt-1' : ''}`}>{children}</p>
      </div>
    </div>
  );
}
