import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Chip from './Chip';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import InfoBox from './InfoBox';
import StarRating from './StarRating';
import Textarea from './Textarea';
import { contactoCompartido } from '../data/panel';

/**
 * Formulario de valoración (cliente → arrendador y arrendador → cliente).
 * `datos` viene de data/panel.jsx (valoracionCliente / valoracionArrendador).
 * Por ahora siempre muestra 5 estrellas y los textos de ejemplo.
 */
export default function FormularioValoracion({ datos, volverA = '/perfil-publico' }) {
  const { calificado, pregunta, chips, comentario, contador, declaracion, publicadoComo } = datos;

  return (
    <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
      <div className="min-w-0 space-y-6">
        <Card className="md:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="size-14" />
            <div>
              <p className="text-caption uppercase tracking-wide text-text-muted">Estás calificando a</p>
              <p className="mt-1 text-heading-md font-semibold text-text">{calificado.nombre}</p>
              <p className="mt-1 text-small text-text-muted">{calificado.detalle}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-heading-lg font-semibold text-text md:text-heading-md">{pregunta}</h2>
            <StarRating size={36} className="mt-5 gap-1.5" />
            <p className="mt-4 text-label font-semibold text-accent">5 de 5 · Excelente experiencia</p>

            <p className="mt-6 text-label font-semibold text-text">¿Qué destacarías?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => <Chip key={chip}>{chip}</Chip>)}
            </div>

            <label htmlFor="comentario" className="mt-6 block text-label font-semibold text-text">Cuéntanos un poco más (opcional)</label>
            <Textarea id="comentario" rows={4} defaultValue={comentario} maxLength={500} className="mt-2" />
            <p className="mt-2 text-small text-text-muted">
              <span className="hidden md:inline">{contador} / 500 caracteres</span>
              <span className="md:hidden">Máximo 500 caracteres. No incluyas datos personales.</span>
            </p>

            <Checkbox id="declaracion-contacto" defaultChecked className="mt-5 text-small md:hidden">
              {declaracion}
            </Checkbox>

            <p className="mt-5 flex items-center gap-3 text-small text-text-muted">
              <Avatar className="hidden size-8 md:flex" />
              {publicadoComo}
            </p>

            <div className="mt-5 space-y-3">
              <Button type="button" size="lg" icon={ArrowRight} fullWidth className="md:h-14">Publicar valoración</Button>
              <Button as={Link} to={volverA} variant="secondary" size="lg" fullWidth className="md:hidden">Cancelar</Button>
            </div>
          </div>
        </Card>

        {/* Móvil: equipo relacionado y aviso al final */}
        <Card className="lg:hidden">
          <h2 className="text-heading-lg font-semibold text-text">Equipo relacionado</h2>
          <ImagenNoEncontrada className="mt-4 aspect-[16/9] w-full rounded-xl" />
          <p className="mt-5 text-heading-sm font-semibold text-text-muted">{contactoCompartido.nombre}</p>
          <p className="mt-3 text-small text-text-muted">Yopal · Referencia de tu experiencia</p>
        </Card>
        <InfoBox title="Honesta, útil y respetuosa" className="lg:hidden">
          Una valoración por persona. No acredita un alquiler ni un servicio realizado. Abrir WhatsApp no demuestra que hubo contacto.
        </InfoBox>
        <Button as={Link} to="/valoraciones/politica" variant="secondary" size="lg" fullWidth className="lg:hidden">
          Consultar política de valoraciones
        </Button>
      </div>

      <aside className="hidden space-y-4 lg:block">
        <Card className="p-5">
          <h2 className="text-label font-semibold text-text">El contacto que compartieron</h2>
          <ImagenNoEncontrada className="mt-4 aspect-[4/3] w-full rounded-xl" />
          <p className="mt-4 text-heading-sm font-semibold text-text">{contactoCompartido.nombre}</p>
          <p className="mt-3 text-small text-text-muted">{contactoCompartido.detalle}</p>
          <a href="#whatsapp" className="mt-4 inline-block text-small font-medium text-text">Consulta directa por WhatsApp ↗</a>
        </Card>
        <Card tone="muted" className="p-5">
          <ShieldCheck size={18} aria-hidden="true" className="text-text" />
          <h2 className="mt-3 text-heading-sm font-semibold text-text">Honesta, útil y respetuosa.</h2>
          <p className="mt-3 text-small text-text-muted">
            Comparte únicamente tu experiencia de contacto. No incluyas datos personales ni información de terceros.
          </p>
          <p className="mt-4 text-small text-text-muted">
            Puedes valorar después de contactar a la otra persona, sin trámites adicionales.
          </p>
        </Card>
      </aside>
    </div>
  );
}
