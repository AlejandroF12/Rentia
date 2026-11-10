const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-muted',
  danger: 'bg-danger-subtle text-danger hover:bg-danger-subtle/70',
};

const sizes = {
  sm: 'h-11 px-3.5 text-small sm:h-9',
  md: 'h-11 px-4 text-label sm:h-10',
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
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) {
  const isNativeButton = Tag === 'button';
  const handleClick = (event) => {
    if (disabled && !isNativeButton) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  return (
    <Tag
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold shadow-sm transition-all hover:shadow-md active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${disabled && !isNativeButton ? 'pointer-events-none cursor-not-allowed opacity-50 shadow-none' : ''} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(isNativeButton
        ? { disabled, onClick }
        : { 'aria-disabled': disabled || undefined, tabIndex: disabled ? -1 : props.tabIndex, onClick: handleClick })}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
      {TrailingIcon && <TrailingIcon size={14} aria-hidden="true" />}
    </Tag>
  );
}
