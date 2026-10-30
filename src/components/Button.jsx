const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-muted',
};

const sizes = {
  sm: 'h-9 px-3.5 text-small',
  md: 'h-10 px-4 text-label',
  lg: 'h-12 px-5 text-label',
};

/**
 * Botón o enlace con aspecto de botón.
 * - as="a" + href para enlaces (cámbialo por <Link> de tu router si usas uno).
 * - icon: icono de lucide a la izquierda; trailingIcon: a la derecha.
 */
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  trailingIcon: TrailingIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
      {TrailingIcon && <TrailingIcon size={14} aria-hidden="true" />}
    </Tag>
  );
}
