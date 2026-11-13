import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadReviewContext, loadReviewForEdit } from '../services/clientService';
import { loadEquipmentImages } from '../services/equipmentService';

export default function ClienteCalificaArrendadorPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('targetUserId');
  const equipmentId = searchParams.get('equipmentId');
  const requestedReviewType = searchParams.get('reviewType') === 'equipo' ? 'equipo' : 'arrendador';
  const volverA = equipmentId ? `/detalle-equipo?id=${encodeURIComponent(equipmentId)}` : '/catalogo';
  const [contextLoad, setContextLoad] = useState({ key: '', value: null, error: '' });
  const [reviewLoad, setReviewLoad] = useState({ key: '', value: null, error: '' });
  const [imageLoad, setImageLoad] = useState({ equipmentId: null, image: null, error: '' });
  const loadKey = `${targetUserId || ''}:${equipmentId || ''}:${requestedReviewType}`;
  useEffect(() => {
    if (!targetUserId || !equipmentId) return;
    let active = true;
    loadReviewContext(targetUserId, equipmentId)
      .then((value) => {
        if (active) setContextLoad({ key: loadKey, value, error: '' });
      })
      .catch((error) => {
        if (active) setContextLoad({ key: loadKey, value: null, error: error.message });
      });
    if (profile?.id) {
      loadReviewForEdit(profile.id, targetUserId, equipmentId, requestedReviewType)
        .then((value) => {
          if (active) setReviewLoad({ key: loadKey, value, error: '' });
        })
        .catch((error) => {
          if (active) setReviewLoad({ key: loadKey, value: null, error: error.message });
        });
    }
    return () => { active = false; };
  }, [targetUserId, equipmentId, profile?.id, requestedReviewType, loadKey]);
  useEffect(() => {
    if (!equipmentId || requestedReviewType !== 'equipo') return undefined;
    let active = true;
    loadEquipmentImages(equipmentId)
      .then((images) => {
        if (active) setImageLoad({ equipmentId, image: images[0]?.url || null, error: '' });
      })
      .catch((error) => {
        if (active) setImageLoad({ equipmentId, image: null, error: error.message });
      });
    return () => { active = false; };
  }, [equipmentId, requestedReviewType]);
  const context = contextLoad.key === loadKey ? contextLoad.value : null;
  const review = reviewLoad.key === loadKey ? reviewLoad.value : null;
  const imageMatchesEquipment = imageLoad.equipmentId === equipmentId;
  const contextError = contextLoad.key === loadKey
    ? contextLoad.error
    : reviewLoad.key === loadKey
      ? reviewLoad.error
      : '';
  const reviewType = requestedReviewType;
  const datos = {
    eyebrow: reviewType === 'equipo' ? 'Cliente → Equipo' : 'Cliente → Arrendador',
    titulo: 'Tu experiencia orienta a otros.',
    calificado: reviewType === 'equipo'
      ? {
          nombre: context?.equipment.name || 'Equipo no seleccionado',
          detalle: context?.equipment.municipality ? `Equipo · ${context.equipment.municipality}` : 'Selecciona un equipo real.',
        }
      : {
          nombre: context?.target.full_name || 'Arrendador no seleccionado',
          detalle: context?.target.municipality ? `Arrendador · ${context.target.municipality}` : 'Selecciona un contacto real.',
          imagen: context?.target.avatar_url,
        },
    pregunta: reviewType === 'equipo' ? '¿Cómo fue tu experiencia con este equipo?' : '¿Cómo fue la atención del arrendador?',
    chips: reviewType === 'equipo' ? ['Buen estado', 'Cumplió lo esperado', 'Información clara'] : ['Buena atención', 'Información clara', 'Estado del equipo'],
    declaracion: 'Declaro que tuve contacto directo previo. Mi valoración describe esa experiencia.',
    publicadoComo: `Se publicará como ${profile?.full_name || 'mi perfil'} · Cliente.`,
    targetUserId,
    equipmentId,
    equipo: reviewType === 'equipo' && context ? {
      nombre: context.equipment.name,
      detalle: context.equipment.municipality,
      imagen: imageMatchesEquipment ? imageLoad.image : null,
      imageError: imageMatchesEquipment ? imageLoad.error : '',
    } : null,
    review,
    reviewType,
    editing: searchParams.get('edit') === '1',
  };
  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: volverA, texto: 'Volver al equipo' }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      {contextError && <p role="alert" className="mt-6 text-small text-danger">{contextError}</p>}
      {!targetUserId || !equipmentId ? <p role="alert" className="mt-6 text-small text-danger">Esta valoración necesita un arrendador y un equipo seleccionados.</p> : null}
      {context && <FormularioValoracion key={`${review?.id || 'new'}-${datos.editing}`} datos={datos} volverA={volverA} />}
    </DashboardLayout>
  );
}
