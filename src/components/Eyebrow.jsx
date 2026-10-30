/** Texto pequeño en mayúsculas sobre los títulos. */
export default function Eyebrow({ children, className = '' }) {
  return (
    <p className={`text-caption font-semibold uppercase tracking-wider text-accent ${className}`}>{children}</p>
  );
}
