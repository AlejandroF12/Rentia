import { MapPin, Plus, X, ChevronDown, ArrowUpRight, UserRound, Settings, Truck, LayoutGrid } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import Badge from './Badge';
import Avatar from './Avatar';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import MenuPanel from './MenuPanel';
import { useAuth } from '../context/AuthContext';

/**
 * variant:
 *  - "public"     visitante (Ingresar + Publicar equipo)
 *  - "cliente" | "arrendador" | "admin"   sesión iniciada (rol + iniciales)
 *  - "simple"     páginas de recuperación de contraseña
 *  - "publicTexto"  visitante con CTA de publicar en páginas de texto (legales, catálogo sin resultados)
 *  - "clienteTexto" cliente con "Cliente · ML" como texto (reportar publicación)
 *  - "suspendido"   cuenta suspendida (insignia "Suspendido" + iniciales)
 * menuOpen: solo cambia el icono (X en vez de hamburguesa/chevron).
 */
export default function Navbar({ variant = 'public', menuOpen = false }) {
  const { pathname, hash } = useLocation();
  const { profile, loading, session } = useAuth();
  const sessionVariant = !loading && profile?.status === 'activo'
    ? profile.role
    : !loading && profile?.status === 'suspendido'
      ? 'suspendido'
      : null;
  const effectiveVariant = sessionVariant || variant;
  const esAdmin = effectiveVariant === 'admin';
  const textoPublico = effectiveVariant === 'publicTexto';
  const textoCliente = effectiveVariant === 'clienteTexto';
  const sinPin = effectiveVariant === 'simple' || textoPublico || textoCliente;
  const sinSesion = effectiveVariant === 'public' || effectiveVariant === 'simple' || textoPublico;
  const role = sessionVariant || (textoCliente ? 'cliente' : effectiveVariant);
  const labels = { cliente: 'Cliente', arrendador: 'Arrendador', admin: 'Administración', suspendido: 'Suspendido' };
  const rol = sinSesion ? null : {
    label: labels[role] || 'Cuenta',
    initials: (profile?.full_name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase(),
  };
  const variantMenu = textoPublico ? 'public' : textoCliente ? 'cliente' : effectiveVariant;
  const [isOpen, setIsOpen] = useState(menuOpen);
  const [isMenuMounted, setIsMenuMounted] = useState(menuOpen);
  const closeTimeout = useRef(null);
  const isMenuOpen = effectiveVariant !== 'simple' && (menuOpen || isOpen);
  const openMenu = () => {
    clearTimeout(closeTimeout.current);
    setIsMenuMounted(true);
    setIsOpen(true);
  };
  const closeMenu = () => setIsOpen(false);
  const accountDestination = session
    ? profile?.status === 'suspendido'
      ? '/cuenta-suspendida'
      : profile?.role === 'admin'
        ? '/admin/resumen'
        : profile?.role === 'arrendador'
          ? '/arrendador/perfil'
          : '/cliente/perfil'
    : '/ingresar';
  const isExploring = pathname === '/catalogo' || pathname.startsWith('/catalogo/') || pathname === '/detalle-equipo';
  const accountLabel = loading
    ? 'Cargando perfil'
    : session
      ? 'Perfil'
      : 'Ingresar';
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);
  useEffect(() => {
    if (isMenuOpen) {
      clearTimeout(closeTimeout.current);
      return undefined;
    }
    if (!isMenuMounted) return undefined;

    const reducedMotion = document.documentElement.dataset.reduceMotion === 'true'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    closeTimeout.current = setTimeout(() => setIsMenuMounted(false), reducedMotion ? 0 : 220);
    return () => clearTimeout(closeTimeout.current);
  }, [isMenuOpen, isMenuMounted]);
  const handleComoFuncionaClick = (event) => {
    if (pathname !== '/' || hash !== '#como-funciona') {
      return;
    }

    event.preventDefault();
    document.getElementById('como-funciona')?.scrollIntoView();
  };

  return (
    <header className="sticky top-0 z-[2000] border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 xl:grid xl:h-[72px] xl:grid-cols-[1fr_auto_1fr] xl:px-16">
        <Logo />

        {/* Navegación central (escritorio) */}
        <nav aria-label="Principal" className="hidden items-center gap-8 text-label xl:flex">
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
        <div className="hidden items-center justify-end gap-5 xl:flex">
          {loading ? (
            <span aria-label="Cargando sesión" className="h-9 w-28 animate-pulse rounded-full bg-surface-muted" />
          ) : rol && textoCliente ? (
            <p className="flex items-center gap-3 text-label font-semibold text-text">
              <span>{rol.label}</span>
              <span aria-hidden="true">·</span>
              <span>{rol.initials || '—'}</span>
            </p>
          ) : rol ? (
            <>
              <Badge tone="neutral">{rol.label}</Badge>
              <button
                type="button"
                aria-label={isMenuOpen ? 'Cerrar menú de usuario' : 'Abrir menú de usuario'}
                className="flex items-center gap-1 rounded-full border border-border p-1 text-text hover:bg-surface-muted"
                onClick={isMenuOpen ? closeMenu : openMenu}
              >
                <Avatar src={profile?.avatar_url} alt={`Foto de ${profile?.full_name || 'tu perfil'}`} className="size-8" />
                <span className="flex size-6 items-center justify-center rounded-full text-text-muted">
                  {isMenuOpen ? <X size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
            </>
          ) : variant === 'simple' ? (
            <p className="flex items-center gap-3 text-label font-semibold text-text">
              <Link to="/ingresar">Ingresar</Link>
              <span aria-hidden="true">·</span>
              <Link to="/crear-cuenta">Publicar equipo</Link>
            </p>
          ) : textoPublico ? (
            <>
              <Link to="/ingresar" className="text-label text-text">Ingresar</Link>
              <Button as={Link} to="/crear-cuenta" size="lg" icon={Plus}>Publicar equipo</Button>
            </>
          ) : (
            <>
              <Link to="/ingresar" className="text-label text-text">Ingresar</Link>
              <Button as={Link} to="/crear-cuenta" size="lg" icon={Plus}>Publicar equipo</Button>
              {isMenuOpen && (
                <button type="button" aria-label="Cerrar menú" className="text-text" onClick={closeMenu}>
                  <X size={18} />
                </button>
              )}
            </>
          )}
          {effectiveVariant !== 'simple' && (
            <Link
              to="/configuracion"
              aria-label="Configuración"
              aria-current={pathname === '/configuracion' ? 'page' : undefined}
              title="Configuración"
              className={`flex size-11 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                pathname === '/configuracion' ? 'bg-surface-muted text-primary' : 'text-text-muted'
              }`}
            >
              <Settings size={19} aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Configuración permanece accesible para visitantes en móvil. */}
        <Link
          to="/configuracion"
          aria-label="Configuración"
          aria-current={pathname === '/configuracion' ? 'page' : undefined}
          title="Configuración"
          className={`flex size-11 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:hidden ${
            pathname === '/configuracion' ? 'bg-surface-muted text-primary' : ''
          }`}
        >
          <Settings size={21} aria-hidden="true" />
        </Link>
      </div>
      {isMenuMounted && effectiveVariant !== 'simple' && (
        <>
          <button type="button" aria-label="Cerrar menú" tabIndex={isMenuOpen ? 0 : -1} aria-hidden={!isMenuOpen} className={`menu-backdrop fixed inset-0 top-16 z-[1000] hidden bg-overlay/40 backdrop-blur-sm xl:top-[72px] xl:block ${isMenuOpen ? 'menu-backdrop-open' : 'menu-backdrop-closed'}`} onClick={closeMenu} />
          <button type="button" aria-label="Cerrar menú" tabIndex={isMenuOpen ? 0 : -1} aria-hidden={!isMenuOpen} className={`menu-backdrop fixed inset-0 z-[2001] bg-overlay/40 backdrop-blur-sm xl:hidden ${isMenuOpen ? 'menu-backdrop-open' : 'menu-backdrop-closed'}`} onClick={closeMenu} />
          <div
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen}
            className={`menu-sheet fixed inset-x-0 bottom-[calc(4.0625rem+env(safe-area-inset-bottom))] z-[2002] xl:inset-x-auto xl:bottom-auto xl:right-16 xl:top-[80px] ${isMenuOpen ? 'menu-sheet-open' : 'menu-sheet-closed'}`}
          >
            <MenuPanel variant={variantMenu} accountOnly={Boolean(rol)} onClose={closeMenu} presentation="bottom" />
          </div>
        </>
      )}
      {effectiveVariant !== 'simple' && (
        <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-[2000] border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_var(--color-shadow-alpha-7)] backdrop-blur xl:hidden">
          <div className="mx-auto grid h-16 max-w-lg grid-cols-3">
            <Link
              to="/catalogo"
              aria-current={isExploring ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-caption font-medium transition-colors ${
                isExploring ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <Truck size={21} aria-hidden="true" />
              Explorar
            </Link>
            <button
              type="button"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
              onClick={isMenuOpen ? closeMenu : openMenu}
              className={`flex flex-col items-center justify-center gap-1 text-caption font-medium transition-colors ${
                isMenuOpen ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              {isMenuOpen ? <X size={21} aria-hidden="true" /> : <LayoutGrid size={21} aria-hidden="true" />}
              Menú
            </button>
            {loading ? (
              <span aria-label="Cargando perfil" className="flex flex-col items-center justify-center gap-1 text-caption text-text-muted">
                <span className="size-[21px] animate-pulse rounded-full bg-surface-muted" />
                Perfil
              </span>
            ) : (
              <Link
                to={accountDestination}
                aria-current={session && pathname === accountDestination ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 text-caption font-medium transition-colors ${
                  session && pathname === accountDestination ? 'text-primary' : 'text-text-muted hover:text-text'
                }`}
              >
                <UserRound size={21} aria-hidden="true" />
                {accountLabel}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
