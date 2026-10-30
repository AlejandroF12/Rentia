/**
 * Pestañas de texto (Todas / Publicadas / Borrador, Enviadas / Recibidas).
 * items: [{ id, label, activo }]. onSelect es opcional (aún sin lógica).
 */
export default function Tabs({ items, onSelect, label = 'Filtros', className = '' }) {
  return (
    <div role="tablist" aria-label={label} className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-small ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={!!item.activo}
          onClick={onSelect ? () => onSelect(item.id) : undefined}
          className={item.activo ? 'font-semibold text-text' : 'text-text-muted'}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
