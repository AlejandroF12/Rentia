import { MapPin, Plus, Menu, X, ChevronDown, ArrowUpRight, UserRound } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import Badge from './Badge';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MenuPanel from './MenuPanel';
import { useAuth } from '../context/AuthContext';

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
  const { profile, loading } = useAuth();
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
  const isMenuOpen = menuOpen || isOpen;
  const MenuIcon = isMenuOpen ? X : Menu;
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);
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
        <button type="button" aria-label={loading ? 'Cargando sesión' : isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} disabled={loading} className="text-text-muted disabled:opacity-50 xl:hidden" onClick={() => setIsOpen((open) => !open)}>
          <MenuIcon size={24} />
        </button>
      </div>
      {isMenuOpen && effectiveVariant !== 'simple' && (
        <>
          <button type="button" aria-label="Cerrar menú" className="fixed inset-0 top-16 z-[1000] bg-overlay/40 backdrop-blur-sm xl:top-[72px]" onClick={() => setIsOpen(false)} />
          <div className="fixed right-0 top-16 z-[1001] w-full sm:right-5 sm:w-auto xl:right-16 xl:top-[80px]">
            <MenuPanel variant={variantMenu} accountOnly={Boolean(rol)} onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </header>
  );
}
