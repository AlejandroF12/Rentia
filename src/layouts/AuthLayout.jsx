import { MapPin } from 'lucide-react';
import Logo from '../components/Logo';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

/** Panel izquierdo con foto (solo escritorio). */
function PanelEditorial() {
  return (
    <aside className="relative hidden overflow-hidden lg:block">
      <ImagenNoEncontrada className="absolute inset-0 size-full" />
      <div className="absolute inset-0 bg-linear-to-t from-overlay-editorial via-overlay/20 to-transparent" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-10 text-text-inverse">
        <Logo inverse />
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-text-inverse-muted">De aquí, para hacer más.</p>
          <p className="mt-4 text-title-desktop font-medium leading-tight">
            El trabajo nos une.<br />El Llano nos mueve.
          </p>
          <p className="mt-6 max-w-sm text-body-lg text-text-inverse-muted">
            Una comunidad de clientes y propietarios que construyen el futuro de Casanare.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 text-label text-text-inverse-muted">
            <MapPin size={14} aria-hidden="true" /> Yopal, Casanare · Colombia
          </p>
        </div>
      </div>
    </aside>
  );
}

/**
 * Estructura de Ingresar / Crear cuenta.
 * enlaceSuperior: texto del enlace de la derecha en escritorio ("Crear una cuenta" / "Ya tengo cuenta").
 */
export default function AuthLayout({ enlaceSuperior, children }) {
  return (
    <div className="min-h-screen bg-surface font-sans text-text lg:grid lg:grid-cols-[38%_1fr]">
      <PanelEditorial />

      <div className="flex min-h-screen flex-col">
        <div className="md:hidden"><Navbar variant="simple" /></div>

        <div className="mx-auto flex w-full max-w-[580px] flex-1 flex-col px-5 py-6 lg:px-0 lg:py-10">
          <div className="flex items-center justify-between text-small">
            <Link to="/" className="text-text-muted">
              <span className="lg:hidden">← Volver</span>
              <span className="hidden lg:inline">← Volver al inicio</span>
            </Link>
            <Link to={enlaceSuperior === 'Ya tengo cuenta' ? '/ingresar' : '/crear-cuenta'} className="hidden text-label font-semibold text-text lg:block">{enlaceSuperior}</Link>
          </div>

          <div className="mt-8 flex-1 lg:flex lg:flex-col lg:justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
