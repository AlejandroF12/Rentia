import { supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';
import { loadProfilePhotoUrls } from './profilePhotoService';

export async function loadPublicProfiles(userIds) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return new Map();

  const result = await supabase.rpc('get_public_profiles', { p_user_ids: ids });

  if (result.error) throw toUserFacingError(result.error, 'No se pudieron cargar los perfiles. Inténtalo nuevamente.');
  const profiles = result.data ?? [];
  const photoUrls = await loadProfilePhotoUrls(profiles.map((profile) => profile.avatar_path));
  return new Map(profiles.map((profile) => [profile.id, {
    ...profile,
    avatar_url: photoUrls.get(profile.avatar_path) ?? null,
  }]));
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
