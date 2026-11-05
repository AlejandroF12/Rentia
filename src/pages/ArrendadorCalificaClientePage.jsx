import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadReviewContext, loadReviewForEdit } from '../services/clientService';

export default function ArrendadorCalificaClientePage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('targetUserId');
  const equipmentId = searchParams.get('equipmentId');
  const reviewType = 'arrendador';
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
  }, [targetUserId, equipmentId, profile?.id, searchParams]);
  const datos = {
    eyebrow: 'Arrendador → Cliente',
    titulo: 'Las buenas relaciones se reconocen.',
    volver: 'Volver a mis equipos',
    calificado: { nombre: context?.target.full_name || 'Cliente no seleccionado', detalle: context?.target.municipality ? `Cliente · ${context.target.municipality}` : 'Selecciona un contacto real.' },
    pregunta: '¿Cómo fue el contacto con el cliente?',
    chips: ['Comunicación clara', 'Respeto', 'Seriedad'],
    declaracion: 'Declaro que tuve contacto directo previo. Mi valoración describe esa experiencia.',
    publicadoComo: `Se publicará como ${profile?.full_name || 'mi perfil'} · Arrendador.`,
    targetUserId,
    equipmentId,
    equipo: context ? { nombre: context.equipment.name, detalle: context.equipment.municipality } : null,
    review,
    reviewType,
    editing: searchParams.get('edit') === '1',
  };
  return (
    <PaginaCuenta rol="arrendador">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      {contextError && <p role="alert" className="mt-6 text-small text-danger">{contextError}</p>}
      {!targetUserId || !equipmentId ? <p role="alert" className="mt-6 text-small text-danger">Esta valoración necesita un cliente y un equipo seleccionados.</p> : null}
      {context && <FormularioValoracion key={`${review?.id || 'new'}-${datos.editing}`} datos={datos} volverA="/arrendador/equipos" />}
    </PaginaCuenta>
  );
}
