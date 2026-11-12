import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from './PageHeader';
import Button from './Button';
import InfoBox from './InfoBox';

/**
 * Página de texto legal con índice lateral (escritorio).
 * contenido: { titulo, subtitulo, secciones: [{ id, titulo, texto }] }  (ver data/legales.jsx)
 */
export default function PaginaLegal({ contenido }) {
  const { titulo, subtitulo, secciones, referencias = [] } = contenido;
  return (
    <PaginaCuenta rol={null} ancho="estrecho" fondo="surface">
      <PageHeader breadcrumb="Inicio / Información y ayuda" eyebrow="Información para la comunidad" titulo={titulo} subtitulo={subtitulo} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <article>
          <InfoBox tone="warning" title="Propuesta pendiente de validación legal">
            Borrador de trabajo, no es asesoría ni certificación jurídica. Los datos del responsable y los canales marcados «Por definir» deben completarse, y los textos deben revisarse jurídicamente antes de reabrir el registro o activar suscripciones.
          </InfoBox>
          <p className="mt-5 text-small text-text-muted">Borrador · 11 de noviembre de 2026 · Colombia</p>

          {secciones.map(({ id, titulo: tituloSeccion, texto }) => (
            <section key={id} id={id} aria-labelledby={`${id}-titulo`} className="mt-8 scroll-mt-6">
              <h2 id={`${id}-titulo`} className="text-heading-md font-semibold text-text">{tituloSeccion}</h2>
              <p className="mt-3 text-body leading-relaxed text-text-muted">{texto}</p>
            </section>
          ))}

          {referencias.length > 0 && (
            <section aria-labelledby="referencias-legales" className="mt-10 border-t border-border pt-6">
              <h2 id="referencias-legales" className="text-heading-md font-semibold text-text">Normativa de referencia</h2>
              <ul className="mt-3 space-y-2">
                {referencias.map(({ titulo: tituloReferencia, url }) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer" className="text-small text-primary underline underline-offset-2">
                      {tituloReferencia}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="orientacion" className="mt-10 rounded-2xl bg-surface-muted p-5 md:p-6">
            <h2 id="orientacion" className="text-heading-md font-semibold text-text md:text-heading-lg">¿Necesitas orientación?</h2>
            <p className="mt-4 text-body leading-relaxed text-text-muted">
              Consulta la orientación disponible en Rentia. Esta versión todavía no tiene un canal externo habilitado para consultas o reclamos de datos personales.
            </p>
            <Button as={Link} to="/ayuda" variant="secondary" size="lg" fullWidth className="mt-4">Ir al Centro de ayuda</Button>
          </section>

          <Button as={Link} to="/catalogo" size="lg" fullWidth className="mt-4">Volver a explorar equipos</Button>
        </article>

        <aside aria-label="Navegación de la página" className="hidden space-y-5 lg:block">
          <nav aria-labelledby="en-esta-pagina" className="rounded-2xl bg-surface-muted p-6">
            <h2 id="en-esta-pagina" className="text-heading-md font-semibold text-text">En esta página</h2>
            <ul className="mt-5 space-y-4">
              {secciones.map(({ id, titulo: tituloSeccion }) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-small text-text">{tituloSeccion} ↓</a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-heading-sm font-semibold text-text">Tu información, tu decisión.</h2>
            <p className="mt-4 text-body text-text-muted">
              Consulta las opciones de orientación disponibles sin publicar información privada.
            </p>
            <Button as={Link} to="/ayuda" variant="secondary" size="lg" fullWidth className="mt-4" trailingIcon={ArrowUpRight}>
              Centro de ayuda
            </Button>
          </section>
        </aside>
      </div>
    </PaginaCuenta>
  );
}
