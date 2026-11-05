import { useNavigate } from 'react-router-dom';
import Eyebrow from './Eyebrow'
import Breadcrumb from './Breadcrumb';

/**
 * Encabezado de página interna.
 * breadcrumb: texto de ruta ("Inicio / Explorar equipos")  ·  volver: { to }  ·  accion: botón o badge a la derecha (escritorio).
 */
export default function PageHeader({ breadcrumb, volver, eyebrow, titulo, subtitulo, accion, className = '' }) {
  const navigate = useNavigate();
  const handleBack = (event) => {
    event.preventDefault();
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate(volver.to, { replace: true });
  };

  return (
    <header className={className}>
      {breadcrumb && <Breadcrumb>{breadcrumb}</Breadcrumb>}
      {volver && (
        <a href={volver.to} onClick={handleBack} className="inline-flex min-h-11 items-center text-small text-text-muted">
          ← Volver
        </a>
      )}
      <div className={`flex flex-col gap-5 md:flex-row md:items-start md:justify-between ${volver || breadcrumb ? 'mt-6' : ''}`}>
        <div className="min-w-0">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-title-mobile font-semibold leading-tight text-text md:text-title-desktop">{titulo}</h1>
          {subtitulo && <p className="mt-2 text-body-lg text-text-muted">{subtitulo}</p>}
        </div>
        {accion && <div className="w-full shrink-0 md:w-auto">{accion}</div>}
      </div>
    </header>
  );
}
