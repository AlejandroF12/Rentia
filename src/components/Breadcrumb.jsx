import { Link } from 'react-router-dom';

const knownRoutes = {
  Inicio: '/',
  'Explorar equipos': '/catalogo',
  'Información y ayuda': '/normas',
};

function normalizeItems(items, children) {
  if (items) return items;
  if (typeof children !== 'string') return [];
  return children.split('/').map((label) => label.trim()).filter(Boolean).map((label, index, labels) => ({
    label,
    to: index < labels.length - 1 ? knownRoutes[label] : undefined,
  }));
}

export default function Breadcrumb({ children, items, className = '' }) {
  const breadcrumbItems = normalizeItems(items, children);

  if (!breadcrumbItems.length) {
    return <p className={`text-small text-text-muted ${className}`}>{children}</p>;
  }

  return (
    <nav aria-label="Migas de pan" className={`text-small text-text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-text hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
