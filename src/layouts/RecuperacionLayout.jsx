import Navbar from '../components/Navbar';
import Eyebrow from '../components/Eyebrow';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import regLogImage from '../media/regLogImage.webp';

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
        <img src={regLogImage} alt="Equipo de trabajo en Casanare" className="mt-6 aspect-[2/1] w-full rounded-2xl object-cover lg:hidden" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div className="min-w-0">{children}</div>
          <aside className="hidden lg:block">
            <img src={regLogImage} alt="Equipo de trabajo en Casanare" className="h-[260px] w-full rounded-2xl object-cover" />
            {lateral}
          </aside>
        </div>
        {pie}
      </main>
      {!pie && <Footer />}
    </div>
  );
}
