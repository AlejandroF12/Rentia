import { supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';
import optimizeImage from '../utils/optimizeImage';
import { validateProfilePhoto } from '../utils/profilePhoto';

const PROFILE_PHOTOS_BUCKET = 'profile-photos';
export { validateProfilePhoto };

export async function loadProfilePhotoUrls(paths) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  const urls = new Map();
  if (!uniquePaths.length) return urls;

  for (let index = 0; index < uniquePaths.length; index += 100) {
    const batch = uniquePaths.slice(index, index + 100);
    const { data, error } = await supabase.storage
      .from(PROFILE_PHOTOS_BUCKET)
      .createSignedUrls(batch, 3600);

    if (error) {
      throw toUserFacingError(error, 'No se pudieron cargar las fotos de perfil. Inténtalo nuevamente.');
    }

    for (const item of data ?? []) {
      if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
    }
  }

  return urls;
}

export async function loadProfilePhotoUrl(path) {
  if (!path) return null;
  const urls = await loadProfilePhotoUrls([path]);
  return urls.get(path) ?? null;
}

export async function uploadProfilePhoto({ userId, file, previousPath }) {
  if (!userId) throw new Error('Inicia sesión nuevamente para cambiar tu foto de perfil.');
  validateProfilePhoto(file);
  let optimizedFile;
  try {
    optimizedFile = await optimizeImage(file);
  } catch (imageError) {
    throw toUserFacingError(imageError, 'No se pudo procesar la foto. Prueba con otra imagen JPG, PNG o WebP.');
  }
  const extension = validateProfilePhoto(optimizedFile);
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const storage = supabase.storage.from(PROFILE_PHOTOS_BUCKET);
  const { error: uploadError } = await storage.upload(path, optimizedFile, {
    contentType: optimizedFile.type,
    upsert: false,
  });

  if (uploadError) {
    throw toUserFacingError(uploadError, 'No se pudo subir la foto. Inténtalo nuevamente.');
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_path: path })
    .eq('id', userId)
    .select('avatar_path')
    .single();

  if (profileError) {
    const { error: cleanupError } = await storage.remove([path]);
    const userError = toUserFacingError(profileError, 'No se pudo guardar la foto en tu perfil.');
    if (cleanupError) {
      throw new Error(`${userError.message} Tampoco se pudo limpiar la imagen subida; inténtalo nuevamente.`);
    }
    throw userError;
  }

  let warning = '';
  if (previousPath && previousPath !== path) {
    const { error: removeError } = await storage.remove([previousPath]);
    if (removeError) warning = 'La foto se actualizó, pero no se pudo borrar la imagen anterior.';
  }

  return { path, warning };
}

export async function removeProfilePhoto({ userId, path }) {
  if (!userId) throw new Error('Inicia sesión nuevamente para cambiar tu foto de perfil.');
  if (!path) return { warning: '' };

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_path: null })
    .eq('id', userId)
    .select('avatar_path')
    .single();

  if (profileError) {
    throw toUserFacingError(profileError, 'No se pudo quitar la foto de tu perfil.');
  }

  const { error: removeError } = await supabase.storage
    .from(PROFILE_PHOTOS_BUCKET)
    .remove([path]);

  return {
    warning: removeError ? 'La foto se quitó del perfil, pero no se pudo borrar el archivo anterior.' : '',
  };
}
