import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadReviewContext, loadReviewForEdit } from '../services/clientService';

export default function ClienteCalificaArrendadorPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('targetUserId');
  const equipmentId = searchParams.get('equipmentId');
  const reviewType = searchParams.get('reviewType') === 'equipo' ? 'equipo' : 'arrendador';
  const [context, setContext] = useState(null);
  const [review, setReview] = useState(null);
  const [contextError, setContextError] = useState('');
  useEffect(() => {
    if (!targetUserId || !equipmentId) return;
    loadReviewContext(targetUserId, equipmentId)
      .then(setContext)
      .catch((error) => setContextError(error.message));
    if (profile?.id) {
      loadReviewForEdit(profile.id, targetUserId, equipmentId, reviewType).then(setReview).catch((error) => setContextError(error.message));
    }
  }, [targetUserId, equipmentId, profile?.id, reviewType]);
  const datos = {
    eyebrow: 'Cliente → Arrendador',
    titulo: 'Tu experiencia orienta a otros.',
    volver: 'Volver a mis valoraciones',
    calificado: { nombre: context?.target.full_name || 'Arrendador no seleccionado', detalle: context?.target.municipality ? `Arrendador · ${context.target.municipality}` : 'Selecciona un contacto real.' },
    pregunta: reviewType === 'equipo' ? '¿Cómo fue tu experiencia con este equipo?' : '¿Cómo fue la atención del arrendador?',
    chips: reviewType === 'equipo' ? ['Buen estado', 'Cumplió lo esperado', 'Información clara'] : ['Buena atención', 'Información clara', 'Estado del equipo'],
    declaracion: 'Declaro que tuve contacto directo previo. Mi valoración describe esa experiencia.',
    publicadoComo: `Se publicará como ${profile?.full_name || 'mi perfil'} · Cliente.`,
    targetUserId,
    equipmentId,
    equipo: context ? { nombre: context.equipment.name, detalle: context.equipment.municipality } : null,
    review,
    reviewType,
    editing: searchParams.get('edit') === '1',
  };
  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: '/cliente/valoraciones', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      {contextError && <p role="alert" className="mt-6 text-small text-danger">{contextError}</p>}
      {!targetUserId || !equipmentId ? <p role="alert" className="mt-6 text-small text-danger">Esta valoración necesita un arrendador y un equipo seleccionados.</p> : null}
      {context && <FormularioValoracion key={`${review?.id || 'new'}-${datos.editing}`} datos={datos} volverA="/cliente/valoraciones" />}
    </DashboardLayout>
  );
}
