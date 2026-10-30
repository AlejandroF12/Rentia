import { ChevronRight, LogOut, ArrowUpRight } from 'lucide-react';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';
import { menus } from '../data/menuConfig';
import { Link } from 'react-router-dom';

/** Contenido de cada menú según el rol. `activo` marca el ítem resaltado. */
export default function MenuPanel({ variant = 'public', onClose }) {
  const m = menus[variant];
  const handleItemClick = (event, item) => {
    if (item.salida) {
      window.localStorage.removeItem('rentia.demoUser');
    }
    onClose?.();
  };

  return (
    <div className="w-full bg-surface p-5 shadow-[0_8px_24px_var(--color-shadow-alpha-7)] md:w-[348px] md:rounded-2xl md:border md:border-border">
      {m.usuario ? (
        <div className="flex items-center gap-3">
          {!m.usuario.sinAvatar && <Avatar className="size-14" />}
          <div>
            <p className={`text-heading-sm text-text ${m.usuario.sinAvatar ? '' : 'font-semibold'}`}>{m.usuario.nombre}</p>
            {m.usuario.detalle && <p className="text-small text-text-muted">{m.usuario.detalle}</p>}
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
        {m.items.map((item) => (
          <li key={item.texto}>
            <Link
              to={item.href ?? '#'}
              onClick={(event) => handleItemClick(event, item)}
              className={`flex h-12 items-center justify-between rounded-lg px-4 text-body ${
                item.activo ? 'bg-primary font-semibold text-primary-foreground' : 'text-text hover:bg-surface-muted'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {item.texto}
                {item.externo && <ArrowUpRight size={12} aria-hidden="true" />}
              </span>
              {item.salida ? <LogOut size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-5 inline-flex items-center gap-1 text-small text-text-muted">
        Centro de ayuda <ArrowUpRight size={10} aria-hidden="true" />
      </p>
      <p className="mt-4 text-small text-text-muted">Privacidad · Términos · Normas</p>

      <Button type="button" variant="secondary" size="lg" fullWidth className="mt-5" onClick={onClose}>Cerrar menú</Button>
    </div>
  );
}
