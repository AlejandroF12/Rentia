/** Foto de perfil. Sin `src` muestra el marcador "imagen no encontrada". */
export default function Avatar({ src, alt = '', className = 'size-12' }) {
  if (src) {
    return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label="imagen no encontrada"
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-muted p-1 text-center text-[8px] leading-tight text-text-muted ${className}`}
    >
      imagen no encontrada
    </div>
  );
}
