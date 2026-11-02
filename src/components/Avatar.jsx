import { UserRound } from 'lucide-react';

/** Foto de perfil. Sin `src` muestra un icono hasta implementar imágenes. */
export default function Avatar({ src, alt = '', className = 'size-12' }) {
  if (src) {
    return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label="Perfil de usuario"
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted ${className}`}
    >
      <UserRound size={18} strokeWidth={1.8} aria-hidden="true" />
    </div>
  );
}
