export default function Breadcrumb({ children, className = '' }) {
  return <p className={`text-small text-text-muted ${className}`}>{children}</p>;
}
