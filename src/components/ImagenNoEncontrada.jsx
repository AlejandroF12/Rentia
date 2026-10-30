/**
 * Marcador para cualquier imagen que aún no esté disponible.
 * Pásale las clases de tamaño/forma desde afuera (h-*, w-*, aspect-*, rounded-*).
 */
export default function ImagenNoEncontrada({ className = '', children = 'imagen no encontrada' }) {
  return (
    <div
      role="img"
      aria-label="imagen no encontrada"
      className={`flex items-center justify-center bg-surface-muted p-2 text-center text-small text-text-muted ${className}`}
    >
      {children}
    </div>
  );
}
