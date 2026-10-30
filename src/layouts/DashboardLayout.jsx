import { Link } from 'react-router-dom';
import { CircleHelp, LogOut, ArrowUpRight } from 'lucide-react';
import Avatar from '../components/Avatar';
import { menusLaterales } from '../data/menuLateral';
import { getUser } from '../data/users';

/** Barra bajo el navbar en móvil: "Arrendador | Carlos Rojas". */
function BarraRol({ rol, className = '' }) {
  const usuario = getUser(rol);
  return (
    <div className={`flex h-10 items-center justify-between border-b border-border bg-surface px-5 text-small ${className}`}>
      <span className="font-semibold text-text">{usuario.label}</span>
      <span className="text-text-muted">{usuario.name}</span>
    </div>
  );
}

/** Variante del panel del arrendador en móvil: pestañas + avatar. */
function BarraPestanas({ rol, activo, className = '' }) {
  const items = menusLaterales[rol].items.filter((item) => item.id !== 'resumen');
  return (
    <nav aria-label="Secundaria" className={`flex h-14 items-center justify-between border-b border-border bg-surface px-5 text-small ${className}`}>
      {items.map((item) => (
        <Link key={item.id} to={item.href} className={item.id === activo ? 'font-semibold text-text' : 'text-text-muted'}>
          {item.texto}
        </Link>
      ))}
      <Avatar className="size-7" />
    </nav>
  );
}

function MenuLateral({ rol, activo }) {
  const menu = menusLaterales[rol];
  return (
    <aside className="hidden w-[216px] shrink-0 border-r border-border bg-surface px-5 py-7 lg:block">
      <p className="text-caption font-semibold uppercase tracking-wider text-text-muted">{menu.titulo}</p>
      <nav aria-label="Secundaria" className="mt-4 space-y-1">
        {menu.items.map(({ id, texto, icono: Icono, href }) => (
          <Link
            key={id}
            to={href}
            aria-current={id === activo ? 'page' : undefined}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-body ${
              id === activo ? 'bg-primary font-semibold text-primary-foreground' : 'text-text-muted hover:bg-surface-muted'
            }`}
          >
            <Icono size={16} aria-hidden="true" />
            {texto}
          </Link>
        ))}
      </nav>

      <div className="mt-4 rounded-xl bg-surface-muted p-4">
        <CircleHelp size={16} aria-hidden="true" className="text-text" />
        <p className="mt-3 text-label font-semibold text-text">Estamos cerca</p>
        <p className="mt-2 text-small text-text-muted">Encuentra orientación para usar Rentia.</p>
        <a href="#ayuda" className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-text">
          Centro de ayuda <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>

      <Link to="/" className="mt-4 inline-flex items-center gap-2 px-1 text-small text-text-muted">
        <LogOut size={14} aria-hidden="true" /> Cerrar sesión
      </Link>
    </aside>
  );
}

/**
 * Contenedor de las áreas privadas CON menú lateral (arrendador / cliente).
 * Va DENTRO de tu MainLayout (que pone navbar y footer).
 * rol: "arrendador" | "cliente"  ·  activo: id del ítem resaltado (ver data/menuLateral.jsx)
 * movil: "rol" (barra Rol | Nombre) o "pestanas" (solo panel del arrendador).
 */
export default function DashboardLayout({ rol = 'arrendador', activo, movil = 'rol', children }) {
  return (
    <div className="bg-background lg:flex lg:min-h-[calc(100vh-72px)]">
      <MenuLateral rol={rol} activo={activo} />
      <div className="min-w-0 flex-1">
        {movil === 'pestanas' ? (
          <BarraPestanas rol={rol} activo={activo} className="lg:hidden" />
        ) : (
          <BarraRol rol={rol} className="lg:hidden" />
        )}
        <div className="mx-auto w-full max-w-[1224px] px-5 py-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}

/**
 * Contenedor de las páginas SIN menú lateral (valoraciones, reportes, legales...).
 * rol: null = sin barra "Rol | Nombre" en móvil  ·  ancho: "amplio" (1312 px útiles) | "estrecho" (1248 px)
 * fondo: "background" (gris claro) | "surface" (blanco)
 */
export function PaginaCuenta({ rol = 'cliente', ancho = 'amplio', fondo = 'background', children }) {
  return (
    <div className={`min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)] ${fondo === 'surface' ? 'bg-surface' : 'bg-background'}`}>
      {rol && <BarraRol rol={rol} className="md:hidden" />}
      <div
        className={`mx-auto w-full px-5 py-6 md:px-8 lg:py-10 ${
          ancho === 'estrecho' ? 'max-w-[1312px]' : 'max-w-[1440px] lg:px-16'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
