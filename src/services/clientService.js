import { supabase } from '../lib/supabaseClient';
import { loadPublicEquipmentOwner, loadPublicProfile as fetchPublicProfile, loadPublicProfiles } from './profileService';

export async function loadClientFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('equipment_id, created_at, equipment:equipment_id(id, name, category, municipality, is_available, publication_status, equipment_images(id, storage_path, display_order, is_cover), reviews(rating, review_type, is_published))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los favoritos: ${error.message}`);
  }

  return (data ?? []).map((favorite) => {
    const equipment = favorite.equipment;
    if (!equipment) return favorite;
    const images = [...(equipment.equipment_images ?? [])].sort((first, second) => (
      Number(second.is_cover) - Number(first.is_cover) || first.display_order - second.display_order
    ));
    const reviews = (equipment.reviews ?? []).filter((review) => review.is_published && review.review_type === 'equipo');
    return {
      ...favorite,
      equipment: {
        ...equipment,
        image: images[0]
          ? supabase.storage.from('equipment-images').getPublicUrl(images[0].storage_path).data.publicUrl
          : null,
        rating: reviews.length
          ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
          : null,
      },
    };
  });
}

export async function updateClientProfile(userId, { fullName, phone, municipality, contactAuthorized }) {
  const updates = {
    full_name: fullName.trim(),
    phone: phone.trim() || null,
    municipality: municipality.trim() || null,
  };
  if (typeof contactAuthorized === 'boolean') updates.contact_authorized = contactAuthorized;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, full_name, email, phone, municipality, role, status, contact_authorized, created_at')
    .single();

  if (error) throw new Error(`No se pudo actualizar el perfil: ${error.message}`);
  return data;
}

export async function loadFavoriteEquipmentIds(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('equipment_id')
    .eq('user_id', userId);

  if (error) throw new Error(`No se pudieron cargar los favoritos: ${error.message}`);
  return (data ?? []).map((item) => item.equipment_id);
}

export async function setFavorite(userId, equipmentId, favorite) {
  const query = supabase.from('favorites');
  const result = favorite
    ? await query.insert({ user_id: userId, equipment_id: equipmentId })
    : await query.delete().eq('user_id', userId).eq('equipment_id', equipmentId);

  if (result.error) throw new Error(`No se pudo actualizar el favorito: ${result.error.message}`);
}

export async function createReport({ reporterId, equipmentId = null, reviewId = null, reason, description }) {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      equipment_id: equipmentId,
      review_id: reviewId,
      reason,
      description: description?.trim() || null,
    })
    .select('id, created_at, status')
    .single();

  if (error) throw new Error(`No se pudo enviar el reporte: ${error.message}`);
  return data;
}

export async function loadClientReport(reportId, reporterId) {
  const { data, error } = await supabase
    .from('reports')
    .select('id, reason, description, status, created_at, equipment:equipment_id(id, name, municipality), review:review_id(id, rating, comment)')
    .eq('id', reportId)
    .eq('reporter_id', reporterId)
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar el reporte: ${error.message}`);
  return data;
}

export async function loadClientReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, highlighted_aspects, review_type, created_at, target_user_id, equipment:equipment_id(id, name)')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las valoraciones: ${error.message}`);
  }

  const profiles = await loadPublicProfiles((data ?? []).map((review) => review.target_user_id));
  return (data ?? []).map(({ target_user_id: targetUserId, ...review }) => ({
    ...review,
    target: profiles.get(targetUserId) ?? null,
  }));
}

export async function loadClientReviewSummary(userId) {
  const [sentResult, receivedResult] = await Promise.all([
    supabase
      .from('reviews')
      .select('id, rating, comment, highlighted_aspects, review_type, created_at, target_user_id, equipment:equipment_id(id, name)')
      .eq('author_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id, rating, comment, highlighted_aspects, review_type, created_at, author_id, equipment:equipment_id(id, name)')
      .eq('target_user_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  if (sentResult.error) {
    throw new Error(`No se pudieron cargar tus valoraciones: ${sentResult.error.message}`);
  }
  if (receivedResult.error) {
    throw new Error(`No se pudieron cargar las valoraciones recibidas: ${receivedResult.error.message}`);
  }

  const profileIds = [
    ...(sentResult.data ?? []).map((review) => review.target_user_id),
    ...(receivedResult.data ?? []).map((review) => review.author_id),
  ];
  const profiles = await loadPublicProfiles(profileIds);
  const sent = (sentResult.data ?? []).map(({ target_user_id: targetUserId, ...review }) => ({
    ...review,
    target: profiles.get(targetUserId) ?? null,
  }));
  const received = (receivedResult.data ?? []).map(({ author_id: authorId, ...review }) => ({
    ...review,
    author: profiles.get(authorId) ?? null,
  }));
  const average = received.length
    ? received.reduce((total, review) => total + review.rating, 0) / received.length
    : null;

  return {
    sent,
    received,
    average,
  };
}

export async function loadPublicProfile(userId) {
  const [profile, contact, equipmentResult, reviewsResult] = await Promise.all([
    fetchPublicProfile(userId),
    loadPublicEquipmentOwner(userId),
    supabase
      .from('equipment')
      .select('id, name, category, municipality, is_available, publication_status')
      .eq('owner_id', userId)
      .eq('publication_status', 'publicada')
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id, rating, comment, highlighted_aspects, review_type, created_at, author_id')
      .eq('target_user_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  if (equipmentResult.error) throw new Error(`No se pudieron cargar los equipos del arrendador: ${equipmentResult.error.message}`);
  if (reviewsResult.error) throw new Error(`No se pudieron cargar las valoraciones: ${reviewsResult.error.message}`);
  const profiles = await loadPublicProfiles((reviewsResult.data ?? []).map((review) => review.author_id));

  if (profile.role !== 'arrendador') throw new Error('El perfil solicitado no corresponde a un arrendador.');

  return {
    profile: { ...profile, phone: contact?.phone || null },
    equipment: equipmentResult.data ?? [],
    reviews: (reviewsResult.data ?? []).map(({ author_id: authorId, ...review }) => ({
      ...review,
      author: profiles.get(authorId) ?? null,
    })),
  };
}

export async function loadReviewContext(targetUserId, equipmentId) {
  const [targetResult, equipmentResult] = await Promise.all([
    fetchPublicProfile(targetUserId),
    supabase
      .from('equipment')
      .select('id, name, municipality, owner_id')
      .eq('id', equipmentId)
      .single(),
  ]);

  if (equipmentResult.error) throw new Error(`No se pudo cargar el equipo relacionado: ${equipmentResult.error.message}`);

  return {
    target: targetResult,
    equipment: equipmentResult.data,
  };
}

export async function createReview({ authorId, targetUserId, equipmentId, rating, comment, highlights, reviewType }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      author_id: authorId,
      target_user_id: targetUserId,
      equipment_id: equipmentId,
      rating,
      comment: comment.trim() || 'Sin comentario.',
      highlighted_aspects: highlights,
      review_type: reviewType,
      is_published: true,
    })
    .select('id, rating, comment, highlighted_aspects, review_type, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya tienes una valoración para esta persona y este equipo.');
    }
    throw new Error(`No se pudo publicar la valoración: ${error.message}`);
  }

  return data;
}

export async function loadReviewForEdit(authorId, targetUserId, equipmentId, reviewType) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, highlighted_aspects, review_type, equipment:equipment_id(id, name, municipality)')
    .eq('author_id', authorId)
    .eq('target_user_id', targetUserId)
    .eq('equipment_id', equipmentId)
    .eq('review_type', reviewType)
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar la valoración: ${error.message}`);
  return data;
}

export async function updateReview({ reviewId, authorId, rating, comment, highlights, reviewType }) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ rating, comment: comment.trim() || 'Sin comentario.', highlighted_aspects: highlights, review_type: reviewType })
    .eq('id', reviewId)
    .eq('author_id', authorId)
    .select('id, rating, comment, highlighted_aspects, created_at')
    .single();

  if (error) throw new Error(`No se pudo actualizar la valoración: ${error.message}`);
  return data;
}
