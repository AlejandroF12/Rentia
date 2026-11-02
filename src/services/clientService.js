import { supabase } from '../lib/supabaseClient';

export async function loadClientFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('equipment_id, created_at, equipment:equipment_id(id, name, category, municipality, is_available, publication_status)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los favoritos: ${error.message}`);
  }

  return data ?? [];
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
    ? await query.upsert({ user_id: userId, equipment_id: equipmentId })
    : await query.delete().eq('user_id', userId).eq('equipment_id', equipmentId);

  if (result.error) throw new Error(`No se pudo actualizar el favorito: ${result.error.message}`);
}

export async function createReport({ reporterId, equipmentId, reason, description }) {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      equipment_id: equipmentId,
      reason,
      description: description?.trim() || null,
    })
    .select('id, created_at, status')
    .single();

  if (error) throw new Error(`No se pudo enviar el reporte: ${error.message}`);
  return data;
}

export async function loadClientReviews(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, target:target_user_id(full_name, role), equipment:equipment_id(name)')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar las valoraciones: ${error.message}`);
  }

  return data ?? [];
}

export async function loadClientReviewSummary(userId) {
  const [sentResult, receivedResult] = await Promise.all([
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at, target:target_user_id(full_name, role), equipment:equipment_id(name)')
      .eq('author_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at, author:author_id(full_name, role), equipment:equipment_id(name)')
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

  const received = receivedResult.data ?? [];
  const average = received.length
    ? received.reduce((total, review) => total + review.rating, 0) / received.length
    : null;

  return {
    sent: sentResult.data ?? [],
    received,
    average,
  };
}

export async function loadPublicProfile(userId) {
  const [profileResult, equipmentResult, reviewsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, phone, municipality, created_at, role')
      .eq('id', userId)
      .eq('role', 'arrendador')
      .single(),
    supabase
      .from('equipment')
      .select('id, name, category, municipality, is_available, publication_status')
      .eq('owner_id', userId)
      .eq('publication_status', 'publicada')
      .order('created_at', { ascending: false }),
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at, author:author_id(full_name)')
      .eq('target_user_id', userId)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
  ]);

  if (profileResult.error) throw new Error(`No se pudo cargar el perfil público: ${profileResult.error.message}`);
  if (equipmentResult.error) throw new Error(`No se pudieron cargar los equipos del arrendador: ${equipmentResult.error.message}`);
  if (reviewsResult.error) throw new Error(`No se pudieron cargar las valoraciones: ${reviewsResult.error.message}`);

  return {
    profile: profileResult.data,
    equipment: equipmentResult.data ?? [],
    reviews: reviewsResult.data ?? [],
  };
}

export async function loadReviewContext(targetUserId, equipmentId) {
  const [targetResult, equipmentResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, municipality, role')
      .eq('id', targetUserId)
      .single(),
    supabase
      .from('equipment')
      .select('id, name, municipality, owner_id')
      .eq('id', equipmentId)
      .eq('owner_id', targetUserId)
      .single(),
  ]);

  if (targetResult.error) throw new Error(`No se pudo cargar la persona a valorar: ${targetResult.error.message}`);
  if (equipmentResult.error) throw new Error(`No se pudo cargar el equipo relacionado: ${equipmentResult.error.message}`);

  return {
    target: targetResult.data,
    equipment: equipmentResult.data,
  };
}

export async function createReview({ authorId, targetUserId, equipmentId, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      author_id: authorId,
      target_user_id: targetUserId,
      equipment_id: equipmentId,
      rating,
      comment: comment.trim(),
      is_published: true,
    })
    .select('id, rating, comment, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya tienes una valoración para esta persona y este equipo.');
    }
    throw new Error(`No se pudo publicar la valoración: ${error.message}`);
  }

  return data;
}
