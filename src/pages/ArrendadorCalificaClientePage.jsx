import { PaginaCuenta } from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import FormularioValoracion from '../components/FormularioValoracion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadLandlordReviewContext, loadReviewForEdit } from '../services/clientService';

export default function ArrendadorCalificaClientePage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('targetUserId');
  const equipmentId = searchParams.get('equipmentId');
  const reviewType = 'arrendador';
  const [contextLoad, setContextLoad] = useState({ key: '', value: null, error: '' });
  const [reviewLoad, setReviewLoad] = useState({ key: '', value: null, error: '' });
  const loadKey = `${profile?.id || ''}:${targetUserId || ''}:${equipmentId || ''}`;
  useEffect(() => {
    if (!targetUserId || !equipmentId || !profile?.id) return;
    let active = true;
    loadLandlordReviewContext(profile.id, targetUserId, equipmentId)
      .then((value) => {
        if (active) setContextLoad({ key: loadKey, value, error: '' });
      })
      .catch((error) => {
        if (active) setContextLoad({ key: loadKey, value: null, error: error.message });
      });
    loadReviewForEdit(profile.id, targetUserId, equipmentId, reviewType)
      .then((value) => {
        if (active) setReviewLoad({ key: loadKey, value, error: '' });
      })
      .catch((error) => {
        if (active) setReviewLoad({ key: loadKey, value: null, error: error.message });
      });
    return () => { active = false; };
  }, [targetUserId, equipmentId, profile?.id, loadKey]);
  const context = contextLoad.key === loadKey ? contextLoad.value : null;
  const review = reviewLoad.key === loadKey ? reviewLoad.value : null;
  const contextError = contextLoad.key === loadKey
    ? contextLoad.error
    : reviewLoad.key === loadKey
      ? reviewLoad.error
      : '';
  const datos = {
    eyebrow: 'Arrendador → Cliente',
    titulo: 'Las buenas relaciones se reconocen.',
    volver: 'Volver a mis valoraciones',
    calificado: {
      nombre: context?.target.full_name || 'Cliente no seleccionado',
      detalle: context?.target.municipality ? `Cliente · ${context.target.municipality}` : 'Selecciona un contacto real.',
      imagen: context?.target.avatar_url,
    },
    pregunta: '¿Cómo fue el contacto con el cliente?',
    chips: ['Comunicación clara', 'Respeto', 'Seriedad'],
    declaracion: 'Declaro que tuve contacto directo previo. Mi valoración describe esa experiencia.',
    publicadoComo: `Se publicará como ${profile?.full_name || 'mi perfil'} · Arrendador.`,
    targetUserId,
    equipmentId,
    equipo: null,
    review,
    reviewType,
    editing: searchParams.get('edit') === '1',
  };
  return (
    <PaginaCuenta rol="arrendador">
      <PageHeader
        volver={{ to: '/arrendador/valoraciones', texto: datos.volver }}
        eyebrow={datos.eyebrow}
        titulo={datos.titulo}
        subtitulo="Valora el contacto que tuviste y ayuda a construir confianza en la región."
      />
      {contextError && <p role="alert" className="mt-6 text-small text-danger">{contextError}</p>}
      {!targetUserId || !equipmentId ? <p role="alert" className="mt-6 text-small text-danger">Esta valoración necesita un cliente y un equipo seleccionados.</p> : null}
      {context && !context.clientReview && !review && (
        <p role="status" className="mt-6 text-small text-text-muted">
          Podrás valorar a este cliente después de que él publique una valoración sobre ti o uno de tus equipos.
        </p>
      )}
      {context && (context.clientReview || review) && <FormularioValoracion key={`${review?.id || 'new'}-${datos.editing}`} datos={datos} volverA="/arrendador/valoraciones" />}
    </PaginaCuenta>
  );
}
