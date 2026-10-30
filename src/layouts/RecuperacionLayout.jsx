import Navbar from '../components/Navbar';
import Eyebrow from '../components/Eyebrow';
import { Link } from 'react-router-dom';

/**
 * Estructura común de los 3 pasos de recuperación.
 * `lateral` es el contenido de la columna derecha (solo escritorio).
 */
export default function RecuperacionLayout({ paso, titulo, subtitulo, lateral, children, pie }) {
  return (
    <div className="min-h-screen bg-surface font-sans text-text">
      <Navbar variant="simple" />

      <main className="mx-auto max-w-[1200px] px-5 pb-16 pt-6 md:px-8 lg:px-16">
        <Link to="/ingresar" className="text-small text-text-muted">← Volver a ingresar</Link>

        <Eyebrow className="mt-6">Recuperar contraseña · Paso {paso} de 3</Eyebrow>
        <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">{titulo}</h1>
        <p className="mt-2 text-body-lg text-text-muted">{subtitulo}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div className="min-w-0">{children}</div>
          {lateral && <aside className="hidden lg:block">{lateral}</aside>}
        </div>
        {pie}
      </main>
    </div>
  );
}
