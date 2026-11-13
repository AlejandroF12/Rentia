import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import InfoBox from '../components/InfoBox';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadReviewContext } from '../services/clientService';
import { loadEquipmentImages } from '../services/equipmentService';

/** Política de valoraciones (paso previo a valorar). */
export default function AntesDeValorarPage() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('targetUserId');
  const equipmentId = searchParams.get('equipmentId');
  const reviewType = searchParams.get('reviewType') === 'equipo' ? 'equipo' : 'arrendador';
  const hasContext = Boolean(targetUserId && equipmentId);
  const nextUrl = `/valoraciones/cliente-a-arrendador?targetUserId=${encodeURIComponent(targetUserId || '')}&equipmentId=${encodeURIComponent(equipmentId || '')}&reviewType=${reviewType}`;
  const equipmentUrl = equipmentId ? `/detalle-equipo?id=${encodeURIComponent(equipmentId)}` : '/catalogo';
  const subject = reviewType === 'equipo' ? 'el equipo' : 'el arrendador';
  const contextKey = `${targetUserId || ''}:${equipmentId || ''}:${reviewType}`;
  const [acknowledgements, setAcknowledgements] = useState({ key: '', contact: false, rules: false });
  const [contextLoad, setContextLoad] = useState({ key: '', value: null, error: '' });
  const [imageLoad, setImageLoad] = useState({ equipmentId: null, image: null, error: '' });
  const contactAcknowledged = acknowledgements.key === contextKey && acknowledgements.contact;
  const rulesAcknowledged = acknowledgements.key === contextKey && acknowledgements.rules;
  const canContinue = Boolean(contextLoad.key === contextKey && contextLoad.value && contactAcknowledged && rulesAcknowledged);
  const updateAcknowledgement = (field, checked) => {
    setAcknowledgements((current) => {
      const currentValues = current.key === contextKey
        ? current
        : { key: contextKey, contact: false, rules: false };
      return { ...currentValues, [field]: checked };
    });
  };

  useEffect(() => {
    if (!hasContext) return undefined;
    let active = true;
    loadReviewContext(targetUserId, equipmentId)
      .then((value) => {
        if (active) setContextLoad({ key: contextKey, value, error: '' });
      })
      .catch((error) => {
        if (active) setContextLoad({ key: contextKey, value: null, error: error.message });
      });
    return () => { active = false; };
  }, [hasContext, targetUserId, equipmentId, contextKey]);

  useEffect(() => {
    if (!equipmentId || reviewType !== 'equipo') return undefined;
    let active = true;
    loadEquipmentImages(equipmentId)
      .then((images) => {
        if (active) setImageLoad({ equipmentId, image: images[0]?.url || null, error: '' });
      })
      .catch((error) => {
        if (active) setImageLoad({ equipmentId, image: null, error: error.message });
      });
    return () => { active = false; };
  }, [equipmentId, reviewType]);

  const context = contextLoad.key === contextKey ? contextLoad.value : null;
  const contextError = contextLoad.key === contextKey ? contextLoad.error : '';
  const imageMatchesEquipment = imageLoad.equipmentId === equipmentId;
  const subjectName = reviewType === 'equipo'
    ? context?.equipment.name || 'Equipo seleccionado'
    : context?.target.full_name || 'Arrendador seleccionado';
  const subjectDetail = reviewType === 'equipo'
    ? context?.equipment.municipality || 'Equipo y propietario seleccionados'
    : context?.target.municipality ? `Arrendador · ${context.target.municipality}` : 'Arrendador seleccionado';

  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: equipmentUrl, texto: 'Volver al equipo' }}
        eyebrow="Política de valoraciones"
        titulo={`Valora ${subject} con honestidad.`}
        subtitulo="Antes de publicar, confirma que conoces la experiencia que vas a compartir."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              {reviewType === 'equipo'
                ? (imageMatchesEquipment && imageLoad.image
                    ? <img src={imageLoad.image} alt={subjectName} className="size-14 shrink-0 rounded-full object-cover" />
                    : <ImagenNoEncontrada className="size-14 shrink-0 rounded-full" />)
                : <Avatar src={context?.target.avatar_url} alt={`Foto de ${subjectName}`} className="size-14" />}
              <div>
                <p className="text-heading-sm font-semibold text-text">
                  {subjectName}
                </p>
                <p className="mt-1 text-small text-text-muted">{subjectDetail}</p>
              </div>
            </div>
            {contextError && <p role="alert" className="mt-4 text-small text-danger">{contextError}</p>}
            {reviewType === 'equipo' && imageMatchesEquipment && imageLoad.error && (
              <p role="status" className="mt-3 text-caption text-text-muted">No pudimos mostrar la foto del equipo; puedes continuar.</p>
            )}
            <h2 className="mt-6 text-heading-lg font-semibold text-text md:text-heading-md">
              {reviewType === 'equipo' ? 'Valora el equipo, no un alquiler.' : 'Valora la atención, no un alquiler.'}
            </h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">
              {reviewType === 'equipo'
                ? 'Comparte cómo fue la información y el estado del equipo. Tu opinión no prueba que se haya realizado un alquiler o un servicio.'
                : 'Comparte cómo fue la comunicación y la atención del arrendador. Tu opinión no prueba que se haya realizado un alquiler o un servicio.'}
            </p>

            <InfoBox title="WhatsApp no confirma contacto" className="mt-5">
              Tocar el botón de WhatsApp o de llamada no demuestra que hablaron. Rentia no lee ni rastrea mensajes externos.
            </InfoBox>

            <div className="mt-5 space-y-4">
              <Checkbox
                id="declaro-contacto"
                className="text-small"
                checked={contactAcknowledged}
                onChange={(event) => updateAcknowledgement('contact', event.target.checked)}
              >
                Declaro que tuve contacto directo previo y que esta valoración refleja mi propia experiencia.
              </Checkbox>
              <Checkbox
                id="entiendo-normas"
                className="text-small"
                checked={rulesAcknowledged}
                onChange={(event) => updateAcknowledgement('rules', event.target.checked)}
              >
                Entiendo que solo puedo tener una valoración por persona y que no debo incluir datos privados ni contenido abusivo.
              </Checkbox>
            </div>

            <div className="mt-5 space-y-3">
              <Button as={Link} to={nextUrl} size="lg" icon={ArrowRight} fullWidth disabled={!canContinue}>Continuar a valorar</Button>
              <Button as={Link} to={equipmentUrl} variant="secondary" size="lg" fullWidth>No he tenido contacto · Volver al equipo</Button>
            </div>
          </Card>

        </div>

        <aside className="hidden lg:block">
          <Card tone="muted">
            <h2 className="text-heading-md font-semibold text-text">¿Ya dejaste una opinión?</h2>
            <p className="mt-4 text-body text-text-muted">
              Solo puedes publicar una valoración por contraparte. Si tu experiencia cambió, edita la que ya existe en Mi espacio → Valoraciones → Enviadas.
            </p>
            <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4">Editar mi valoración existente</Button>
            <p className="mt-5 text-body text-text-muted">
              Si una opinión contiene insultos o datos personales, usa “Reportar valoración” para solicitar revisión privada.
            </p>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
