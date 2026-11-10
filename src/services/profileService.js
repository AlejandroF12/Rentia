import { supabase } from '../lib/supabaseClient';

export async function loadPublicProfiles(userIds) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return new Map();

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(`No se pudo verificar la sesión para cargar perfiles: ${sessionError.message}`);

  const result = sessionData.session
    ? await supabase.rpc('get_public_profiles', { p_user_ids: ids })
    : await supabase
      .from('profiles')
      .select('id, full_name, municipality, role, created_at')
      .in('id', ids);

  if (result.error) throw new Error(`No se pudieron cargar los perfiles públicos: ${result.error.message}`);
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
  if (error) throw new Error(`No se pudo cargar el contacto del arrendador: ${error.message}`);
  return data?.[0] ?? null;
}
