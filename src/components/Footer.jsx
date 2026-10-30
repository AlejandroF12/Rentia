import Logo from './Logo';

/**
 * links: texto de enlaces legales. copyright: texto de derechos.
 * Ej. perfil público: links="Privacidad · Términos · Normas · Ayuda"
 */
export default function Footer({
  links = 'Privacidad · Términos · Ayuda',
  copyright = '© 2026 Rentia',
  className = '',
}) {
  return (
    <footer className={`border-t border-border bg-surface ${className}`}>
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 lg:px-16">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">
          <Logo />
          <p className="hidden text-center text-body text-text-muted md:block">La fuerza de nuestra región, más cerca.</p>
          <p className="text-small text-text-muted md:text-right">Hecho en Casanare</p>
        </div>
        <div className="mt-8 flex flex-col gap-3 text-small text-text-muted md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>
          <p>{links}</p>
        </div>
      </div>
    </footer>
  );
}
