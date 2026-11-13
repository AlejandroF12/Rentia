import { UserRound } from 'lucide-react';
import { useState } from 'react';

/** Foto de perfil con un icono de respaldo si no hay imagen disponible. */
export default function Avatar({ src, alt = '', className = 'size-12' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (src && failedSrc !== src) {
    return <img src={src} alt={alt} onError={() => setFailedSrc(src)} className={`rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label={alt || 'Perfil de usuario'}
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted ${className}`}
    >
      <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
    </div>
  );
}
