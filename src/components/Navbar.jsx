import { MapPin, Plus, Menu, X, ChevronDown, ArrowUpRight, UserRound } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import Badge from './Badge';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MenuPanel from './MenuPanel';
import { getUser } from '../data/users';

/**
 * variant:
 *  - "public"     visitante (Ingresar + Publicar equipo)
 *  - "cliente" | "arrendador" | "admin"   sesión iniciada (rol + iniciales)
 *  - "simple"     páginas de recuperación de contraseña
 *  - "publicTexto"  visitante con "Ingresar · Publicar equipo" como texto (legales, catálogo sin resultados)
 *  - "clienteTexto" cliente con "Cliente · ML" como texto (reportar publicación)
 *  - "suspendido"   cuenta suspendida (insignia "Suspendido" + iniciales)
 * menuOpen: solo cambia el icono (X en vez de hamburguesa/chevron).
 */
export default function Navbar({ variant = 'public', menuOpen = false }) {
  const { pathname, hash } = useLocation();
  const esAdmin = variant === 'admin';
  const textoPublico = variant === 'publicTexto';
  const textoCliente = variant === 'clienteTexto';
  const sinPin = variant === 'simple' || textoPublico || textoCliente;
  const sinSesion = variant === 'public' || variant === 'simple' || textoPublico;
  const rol = sinSesion ? null : getUser(textoCliente ? 'cliente' : variant);
  const variantMenu = textoPublico ? 'public' : textoCliente ? 'cliente' : variant;
  const [isOpen, setIsOpen] = useState(menuOpen);
  const isMenuOpen = menuOpen || isOpen;
  const MenuIcon = isMenuOpen ? X : Menu;
  const handleComoFuncionaClick = (event) => {
    if (pathname !== '/' || hash !== '#como-funciona') {
      return;
    }

    event.preventDefault();
    document.getElementById('como-funciona')?.scrollIntoView();
  };

  return (
    <header className="sticky top-0 z-[2000] border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:grid md:h-[72px] md:grid-cols-[1fr_auto_1fr] md:px-8 lg:px-16">
        <Logo />

        {/* Navegación central (escritorio) */}
        <nav aria-label="Principal" className="hidden items-center gap-8 text-label md:flex">
          {esAdmin ? (
            <>
              <Link to="/admin/usuarios" className="font-semibold text-text">Centro de moderación</Link>
              <Link to="/" className="inline-flex items-center gap-1 text-text-muted">
                Ver sitio público <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/catalogo" className="font-semibold text-text">Explorar equipos</Link>
              <Link to="/#como-funciona" onClick={handleComoFuncionaClick} className="text-text-muted">Cómo funciona</Link>
            </>
          )}
          <span className="inline-flex items-center gap-1.5 text-text-muted">
            {!sinPin && <MapPin size={14} aria-hidden="true" />}
            Casanare, Colombia
          </span>
        </nav>

        {/* Acciones (escritorio) */}
        <div className="hidden items-center justify-end gap-5 md:flex">
          {rol && textoCliente ? (
            <p className="flex items-center gap-3 text-label font-semibold text-text">
              <span>{rol.label}</span>
              <span aria-hidden="true">·</span>
              <span>{rol.initials}</span>
            </p>
          ) : rol ? (
            <>
              <Badge tone="neutral">{rol.label}</Badge>
              <button
                type="button"
                aria-label={isMenuOpen ? 'Cerrar menú de usuario' : 'Abrir menú de usuario'}
                className="flex items-center gap-1 rounded-full border border-border p-1 text-text hover:bg-surface-muted"
                onClick={() => setIsOpen((open) => !open)}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                  <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="flex size-6 items-center justify-center rounded-full text-text-muted">
                  {isMenuOpen ? <X size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
            </>
          ) : variant === 'simple' || textoPublico ? (
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
          <button type="button" aria-label="Cerrar menú" className="fixed inset-0 top-16 z-[1000] bg-overlay/40 backdrop-blur-sm md:top-[72px]" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-16 z-[1001] w-full md:right-8 md:top-[80px] md:w-auto lg:right-16">
            <MenuPanel variant={variantMenu} accountOnly={Boolean(rol)} onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </header>
  );
}
