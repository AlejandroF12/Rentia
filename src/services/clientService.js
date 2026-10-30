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
