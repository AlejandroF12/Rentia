const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PROFILE_PHOTO_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function validateProfilePhoto(file) {
  if (!file || !PROFILE_PHOTO_EXTENSIONS[file.type]) {
    throw new Error('Elige una imagen JPG, PNG o WebP.');
  }
  if (file.size <= 0 || file.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new Error('La foto debe pesar como máximo 5 MB.');
  }
  return PROFILE_PHOTO_EXTENSIONS[file.type];
}
