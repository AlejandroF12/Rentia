export default function ReviewHighlights({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2" aria-label="Aspectos destacados">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-success-subtle px-3 py-1 text-caption font-semibold text-success">
          {item}
        </span>
      ))}
    </div>
  );
}
