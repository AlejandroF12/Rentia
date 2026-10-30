export default function Checkbox({ id, children, className = '', ...props }) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-2.5 text-label text-text-muted ${className}`}>
      <input id={id} type="checkbox" className="mt-0.5 size-4 shrink-0 rounded accent-primary" {...props} />
      <span>{children}</span>
    </label>
  );
}
