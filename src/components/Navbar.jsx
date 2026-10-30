import { MapPin, Plus, Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import Badge from './Badge';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MenuPanel from './MenuPanel';
import { getUser } from '../data/users';

/**
 * variant:
 *  - "public"     visitante (Ingresar + Publicar equipo)
 *  - "cliente" | "arrendador" | "admin"   sesión iniciada (rol + iniciales)
 *  - "simple"     páginas de recuperación de contraseña
 * menuOpen: solo cambia el icono (X en vez de hamburguesa/chevron).
 */
export default function Navbar({ variant = 'public', menuOpen = false }) {
  const esAdmin = variant === 'admin';
  const rol = variant === 'public' || variant === 'simple' ? null : getUser(variant);
  const [isOpen, setIsOpen] = useState(menuOpen);
  const isMenuOpen = menuOpen || isOpen;
  const MenuIcon = isMenuOpen ? X : Menu;

  return (
    <header className="relative z-30 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:grid md:h-[72px] md:grid-cols-[1fr_auto_1fr] md:px-8 lg:px-16">
        <Logo />

        {/* Navegación central (escritorio) */}
        <nav aria-label="Principal" className="hidden items-center gap-8 text-label md:flex">
          {esAdmin ? (
            <>
              <Link to="/menu-administracion" className="font-semibold text-text">Centro de moderación</Link>
              <Link to="/" className="inline-flex items-center gap-1 text-text-muted">
                Ver sitio público <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/catalogo" className="font-semibold text-text">Explorar equipos</Link>
              <a href="#como-funciona" className="text-text-muted">Cómo funciona</a>
            </>
          )}
          <span className="inline-flex items-center gap-1.5 text-text-muted">
            {variant !== 'simple' && <MapPin size={14} aria-hidden="true" />}
            Casanare, Colombia
          </span>
        </nav>

        {/* Acciones (escritorio) */}
        <div className="hidden items-center justify-end gap-5 md:flex">
          {rol ? (
            <>
              <Badge tone="neutral">{rol.label}</Badge>
              <span className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-small font-semibold text-text">
                {rol.initials}
              </span>
              <button type="button" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="text-text" onClick={() => setIsOpen((open) => !open)}>
                {isMenuOpen ? <X size={18} /> : <ChevronDown size={18} />}
              </button>
            </>
          ) : variant === 'simple' ? (
            <p className="flex items-center gap-3 text-label font-semibold text-text">
              <Link to="/ingresar">Ingresar</Link>
              <span aria-hidden="true">·</span>
              <Link to="/crear-cuenta">Publicar equipo</Link>
            </p>
          ) : (
            <>
              <Link to="/ingresar" className="text-label text-text">Ingresar</Link>
              <Button as={Link} to="/crear-cuenta" size="lg" icon={Plus}>Publicar equipo</Button>
              {isMenuOpen && (
                <button type="button" aria-label="Cerrar menú" className="text-text">
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Hamburguesa (móvil) */}
        <button type="button" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="text-text-muted md:hidden" onClick={() => setIsOpen((open) => !open)}>
          <MenuIcon size={24} />
        </button>
      </div>
      {isMenuOpen && variant !== 'simple' && (
        <>
          <button type="button" aria-label="Cerrar menú" className="fixed inset-0 top-16 z-10 bg-overlay/40 md:top-[72px]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-20 w-full md:right-8 md:top-[80px] md:w-auto lg:right-16">
            <MenuPanel variant={variant} onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </header>
  );
}
