import { supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';

export async function loadPublicProfiles(userIds) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return new Map();

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw toUserFacingError(sessionError, 'No se pudo verificar la sesión. Inténtalo nuevamente.');

  const result = sessionData.session
    ? await supabase.rpc('get_public_profiles', { p_user_ids: ids })
    : await supabase
      .from('profiles')
      .select('id, full_name, municipality, role, created_at')
      .in('id', ids);

  if (result.error) throw toUserFacingError(result.error, 'No se pudieron cargar los perfiles. Inténtalo nuevamente.');
  return new Map((result.data ?? []).map((profile) => [profile.id, profile]));
}

export async function loadPublicProfile(userId) {
  const profiles = await loadPublicProfiles([userId]);
  const profile = profiles.get(userId);
  if (!profile) throw new Error('No se encontró un perfil público activo.');
  return profile;
}

export async function loadPublicEquipmentOwner(userId) {
  const { data, error } = await supabase.rpc('get_public_equipment_owner', { p_owner_id: userId });
  if (error) throw toUserFacingError(error, 'No se pudo cargar la información de contacto. Inténtalo nuevamente.');
  return data?.[0] ?? null;
}
