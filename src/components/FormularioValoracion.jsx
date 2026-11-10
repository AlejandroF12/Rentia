import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Chip from './Chip';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import InfoBox from './InfoBox';
import StarRating from './StarRating';
import Textarea from './Textarea';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview, updateReview } from '../services/clientService';

/**
 * Formulario de valoración (persona y equipo relacionados).
 * `datos` contiene el contexto de la persona que se está valorando.
 */
export default function FormularioValoracion({ datos, volverA = '/perfil-publico' }) {
  const { calificado, pregunta, chips, declaracion, publicadoComo, equipo, reviewType = 'arrendador' } = datos;
  const comentario = datos.review?.comment || datos.comentario || '';
  const { session } = useAuth();
  const location = useLocation();
  const [rating, setRating] = useState(datos.review?.rating || 0);
  const [selectedChips, setSelectedChips] = useState(datos.review?.highlighted_aspects || []);
  const [accepted, setAccepted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const isEditing = Boolean(datos.review?.id && datos.editing);
  const canSubmit = Boolean(datos.targetUserId && datos.equipmentId && rating && accepted && !submitting);

  const toggleChip = (chip) => {
    setSelectedChips((current) => current.includes(chip)
      ? current.filter((item) => item !== chip)
      : [...current, chip]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!datos.targetUserId || !datos.equipmentId) {
      setSubmitError('Abre este formulario desde un contacto y un equipo válidos.');
      return;
    }
    if (!rating) {
      setSubmitError('Selecciona una puntuación de 1 a 5 estrellas.');
      return;
    }
    if (!accepted) {
      setSubmitError('Confirma que tuviste contacto directo antes de publicar.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const text = String(formData.get('comentario') || '').trim();
    try {
      const comment = text || 'Sin comentario.';
      if (isEditing) {
        await updateReview({ reviewId: datos.review.id, authorId: session.user.id, rating, comment, highlights: selectedChips, reviewType });
      } else {
        await createReview({
          authorId: session.user.id,
          targetUserId: datos.targetUserId,
          equipmentId: datos.equipmentId,
          rating,
          comment,
          highlights: selectedChips,
          reviewType,
        });
      }
      setSuccess(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_288px] lg:items-start lg:gap-8">
      <div className="min-w-0 space-y-6">
        {datos.review && !datos.editing && (
          <Card className="border-primary/30 bg-surface-muted p-5 sm:p-6">
            <p className="text-label font-semibold text-text">Ya tienes una valoración para este contacto y equipo.</p>
            <p className="mt-2 text-small text-text-muted">Puedes consultar la valoración existente o editarla en lugar de publicar otra.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={`${location.pathname}?${new URLSearchParams({ targetUserId: datos.targetUserId, equipmentId: datos.equipmentId, edit: '1' })}`} size="lg">
                Editar esta valoración
              </Button>
              <Button as={Link} to={volverA} variant="secondary" size="lg">Volver</Button>
            </div>
          </Card>
        )}
        {(!datos.review || datos.editing) && (
        <form onSubmit={handleSubmit} className="min-w-0">
        <Card className="p-5 sm:p-6 md:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="size-14" />
            <div>
              <p className="text-caption uppercase tracking-wide text-text-muted">Estás calificando a</p>
              <p className="mt-1 text-heading-md font-semibold text-text">{calificado.nombre}</p>
              <p className="mt-1 text-small text-text-muted">{calificado.detalle}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-heading-lg font-semibold leading-tight text-text md:text-heading-md">{pregunta}</h2>
            <StarRating size={36} value={rating} onChange={setRating} className="mt-5 gap-1.5" disabled={success} />
            <p className="mt-4 text-label font-semibold text-accent">{rating ? `${rating} de 5` : 'Selecciona una puntuación'}</p>

            <p className="mt-6 text-label font-semibold text-text">Aspectos destacados</p>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Aspectos destacados">
              {chips.map((chip) => (
                <button key={chip} type="button" onClick={() => toggleChip(chip)} disabled={success} aria-pressed={selectedChips.includes(chip)} className={`rounded-lg border px-3 py-2 text-small font-medium ${selectedChips.includes(chip) ? 'border-success bg-success text-text-inverse' : 'border-success/30 bg-success-subtle text-success'}`}>
                  <Chip>{chip}</Chip>
                </button>
              ))}
            </div>

            <label htmlFor="comentario" className="mt-6 block text-label font-semibold text-text">Cuéntanos un poco más (opcional)</label>
            <Textarea id="comentario" name="comentario" rows={4} defaultValue={comentario} maxLength={500} className="mt-2" />
            <p className="mt-2 text-small text-text-muted">
              <span className="hidden md:inline">Máximo 500 caracteres</span>
              <span className="md:hidden">Máximo 500 caracteres. No incluyas datos personales.</span>
            </p>

            <Checkbox id="declaracion-contacto" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} disabled={success} className="mt-5 text-small">
              {declaracion}
            </Checkbox>

            <div className="mt-5 flex items-center gap-3 text-small text-text-muted">
              <Avatar className="hidden size-8 md:flex" />
              {publicadoComo}
            </div>

            {submitError && <p role="alert" className="mt-5 text-small text-danger">{submitError}</p>}
            {success && <InfoBox tone="success" title={isEditing ? 'Valoración actualizada' : 'Valoración publicada'} className="mt-5">Gracias por compartir una experiencia real.</InfoBox>}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button type="submit" size="lg" icon={ArrowRight} fullWidth className="md:h-14" disabled={!canSubmit}>{submitting ? 'Guardando...' : success ? (isEditing ? 'Valoración actualizada' : 'Valoración publicada') : (isEditing ? 'Guardar cambios' : 'Publicar valoración')}</Button>
              <Button as={Link} to={volverA} variant="secondary" size="lg" fullWidth className="md:hidden">Cancelar</Button>
            </div>
          </div>
        </Card>
        </form>
        )}

        {/* Móvil: equipo relacionado y aviso al final */}
        <Card className="lg:hidden p-5">
          <h2 className="text-heading-lg font-semibold text-text">Equipo relacionado</h2>
          <ImagenNoEncontrada className="mt-4 aspect-[16/9] w-full rounded-xl" />
          <p className="mt-5 text-heading-sm font-semibold text-text-muted">{equipo?.nombre || 'Equipo relacionado'}</p>
          <p className="mt-3 text-small text-text-muted">{equipo?.detalle || 'Referencia de tu experiencia'}</p>
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
          <p className="mt-4 text-heading-sm font-semibold text-text">{equipo?.nombre || 'Equipo relacionado'}</p>
          <p className="mt-3 text-small text-text-muted">{equipo?.detalle || 'Referencia de tu experiencia'}</p>
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
