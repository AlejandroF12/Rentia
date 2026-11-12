import { ChevronRight, LogOut, ArrowUpRight, Settings } from 'lucide-react';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import { menus } from '../data/menuConfig';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Contenido de cada menú según el rol. `activo` marca el ítem resaltado. */
export default function MenuPanel({ variant = 'public', onClose, accountOnly = false, presentation = 'popover' }) {
  const { profile, signOut } = useAuth();
  const { pathname } = useLocation();
  const m = menus[variant];
  const profileRole = { cliente: 'Cliente', arrendador: 'Arrendador', admin: 'Administración' }[profile?.role] || 'Cuenta';
  const user = m.usuario && profile
    ? {
      ...m.usuario,
      nombre: profile.full_name,
      detalle: profile.municipality ? `${profileRole} · ${profile.municipality}` : m.usuario.detalle,
    }
    : m.usuario;
  const activeItem = m.items
    .filter((item) => (
      item.href
      && !item.salida
      && (pathname === item.href || pathname.startsWith(`${item.href}/`))
    ))
    .sort((first, second) => second.href.length - first.href.length)[0];
  let items = presentation === 'bottom'
    ? m.items
    : accountOnly
      ? m.items.filter((item) => item.salida || item.texto === 'Mi perfil' || item.href === '/catalogo')
      : m.items;
  if (presentation === 'bottom') {
    items = items.filter((item) => item.href !== '/catalogo' && item.href !== '/ingresar' && item.texto !== 'Mi perfil');
  }
  const handleItemClick = async (event, item) => {
    if (item.salida) {
      event.preventDefault();
      const { error } = await signOut();
      if (error) {
        console.error(`No se pudo cerrar la sesión: ${error.message}`);
        return;
      }
      window.location.assign('/');
    }
    onClose?.();
  };

  return (
    <div className={`menu-scroll-panel max-h-[calc(100dvh-4rem)] w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-surface p-5 shadow-[0_8px_24px_var(--color-shadow-alpha-7)] ${
      presentation === 'bottom'
        ? 'max-h-[calc(100dvh-9rem-env(safe-area-inset-bottom))] rounded-t-2xl border-t border-border pb-[calc(1.25rem+env(safe-area-inset-bottom))] xl:max-h-[calc(100dvh-5rem)] xl:w-[348px] xl:rounded-2xl xl:border xl:pb-5'
        : 'md:max-h-[calc(100dvh-5rem)] md:w-[348px] md:rounded-2xl md:border md:border-border'
    }`}>
      {user ? (
        <div className="flex min-w-0 items-center gap-3">
          {!user.sinAvatar && <Avatar className="size-14" />}
          <div className="min-w-0 flex-1">
            <p className={`break-words text-heading-sm text-text [overflow-wrap:anywhere] ${user.sinAvatar ? '' : 'font-semibold'}`}>{user.nombre}</p>
            {user.detalle && <p className="text-small text-text-muted">{user.detalle}</p>}
          </div>
        </div>
      ) : (
        <>
          <p className="text-small text-text-muted">{m.superior}</p>
          <p className="mt-4 text-heading-md font-semibold text-text">{m.titulo}</p>
        </>
      )}

      {m.rol && <Badge tone="neutral" className="mt-4">{m.rol}</Badge>}

      <ul className={m.rol ? 'mt-4' : 'mt-8'}>
        {items.map((item) => (
          <li key={item.texto}>
            <Link
              to={item.href ?? '#'}
              onClick={(event) => handleItemClick(event, item)}
              className={`flex min-h-12 items-center justify-between gap-3 rounded-lg px-4 py-2 text-body ${
                item === activeItem || (!activeItem && item.activo)
                  ? 'bg-primary font-semibold text-primary-foreground'
                  : 'text-text hover:bg-surface-muted'
              }`}
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                {item.texto}
                {item.externo && <ArrowUpRight size={12} aria-hidden="true" />}
              </span>
              {item.salida ? <LogOut size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-2 border-t border-border pt-2">
        <Link
          to="/configuracion"
          onClick={onClose}
          aria-current={pathname === '/configuracion' ? 'page' : undefined}
          className={`flex min-h-12 items-center justify-between gap-3 rounded-lg px-4 py-2 text-body ${
            pathname === '/configuracion' ? 'bg-primary font-semibold text-primary-foreground' : 'text-text hover:bg-surface-muted'
          }`}
        >
          <span className="inline-flex items-center gap-2"><Settings size={16} aria-hidden="true" /> Configuración</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <Link to="/ayuda" onClick={onClose} className="mt-5 inline-flex min-h-11 items-center gap-1 text-small text-text-muted">
        Centro de ayuda <ArrowUpRight size={10} aria-hidden="true" />
      </Link>
      <nav aria-label="Información legal" className="mt-4">
        <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-small text-text-muted">
          <li><Link to="/privacidad" onClick={onClose} className="min-h-11 inline-flex items-center hover:text-text">Privacidad</Link></li>
          <li aria-hidden="true">·</li>
          <li><Link to="/terminos" onClick={onClose} className="min-h-11 inline-flex items-center hover:text-text">Términos</Link></li>
          <li aria-hidden="true">·</li>
          <li><Link to="/normas" onClick={onClose} className="min-h-11 inline-flex items-center hover:text-text">Normas</Link></li>
        </ul>
      </nav>

      <Button type="button" variant="secondary" size="lg" fullWidth className="mt-5" onClick={onClose}>Cerrar menú</Button>
    </div>
  );
}
