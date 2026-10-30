import { Link } from 'react-router-dom';
import Eyebrow from './Eyebrow';

/**
 * Encabezado de página interna.
 * volver: { to, texto }  ·  accion: botón o badge a la derecha (escritorio).
 */
export default function PageHeader({ volver, eyebrow, titulo, subtitulo, accion, className = '' }) {
  return (
    <header className={className}>
      {volver && (
        <Link to={volver.to} className="text-small text-text-muted">
          ← {volver.texto}
        </Link>
      )}
      <div className={`flex flex-col gap-5 md:flex-row md:items-start md:justify-between ${volver ? 'mt-6' : ''}`}>
        <div className="min-w-0">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-title-mobile font-semibold leading-tight text-text md:text-title-desktop">{titulo}</h1>
          {subtitulo && <p className="mt-2 text-body-lg text-text-muted">{subtitulo}</p>}
        </div>
        {accion}
      </div>
    </header>
  );
}
