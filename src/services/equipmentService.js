import { supabase } from '../lib/supabaseClient';
import { loadPublicEquipmentOwner } from './profileService';

const imageUrl = (path) => supabase.storage.from('equipment-images').getPublicUrl(path).data.publicUrl;

async function optimizeImage(file) {
  if (!file.type.startsWith('image/') || typeof createImageBitmap !== 'function') return file;

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1920;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
  return blob ? new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' }) : file;
}

export async function loadEquipmentImages(equipmentId) {
  const { data, error } = await supabase
    .from('equipment_images')
    .select('id, storage_path, display_order, is_cover')
    .eq('equipment_id', equipmentId)
    .order('is_cover', { ascending: false })
    .order('display_order', { ascending: true });

  if (error) throw new Error(`No se pudieron cargar las imágenes: ${error.message}`);
  return (data ?? []).map((image) => ({ ...image, url: imageUrl(image.storage_path) }));
}

export async function loadEquipmentCoverImages(equipmentIds) {
  const ids = [...new Set(equipmentIds.filter(Boolean))];
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from('equipment_images')
    .select('equipment_id, storage_path, display_order, is_cover')
    .in('equipment_id', ids)
    .order('is_cover', { ascending: false })
    .order('display_order', { ascending: true });

  if (error) throw new Error(`No se pudieron cargar las imágenes: ${error.message}`);

  const coverImages = new Map();
  for (const image of data ?? []) {
    if (!coverImages.has(image.equipment_id)) {
      coverImages.set(image.equipment_id, imageUrl(image.storage_path));
    }
  }
  return coverImages;
}

export async function uploadEquipmentImages(equipmentId, files) {
  const uploaded = [];
  const existing = await loadEquipmentImages(equipmentId);
  const hasCover = existing.some((image) => image.is_cover);
  for (const [index, file] of files.entries()) {
    const optimizedFile = await optimizeImage(file);
    const path = `${equipmentId}/${crypto.randomUUID()}-${optimizedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error: uploadError } = await supabase.storage.from('equipment-images').upload(path, optimizedFile, { upsert: false, contentType: optimizedFile.type });
    if (uploadError) throw new Error(`No se pudo subir la imagen: ${uploadError.message}`);
    const { data, error } = await supabase
      .from('equipment_images')
      .insert({ equipment_id: equipmentId, storage_path: path, display_order: existing.length + index, is_cover: !hasCover && index === 0 })
      .select('id, storage_path, display_order, is_cover')
      .single();
    if (error) throw new Error(`No se pudo registrar la imagen: ${error.message}`);
    uploaded.push({ ...data, url: imageUrl(path) });
  }
  return uploaded;
}

export async function deleteEquipmentImage(image) {
  const { error: storageError } = await supabase.storage.from('equipment-images').remove([image.storage_path]);
  if (storageError) throw new Error(`No se pudo eliminar la imagen: ${storageError.message}`);
  const { error } = await supabase.from('equipment_images').delete().eq('id', image.id);
  if (error) throw new Error(`No se pudo eliminar el registro de imagen: ${error.message}`);
}

export async function createEquipment(ownerId, values, publicationStatus = 'publicada') {
  const { data, error } = await supabase
    .from('equipment')
    .insert({
      owner_id: ownerId,
      name: values.name,
      category: values.category,
      brand: values.brand || null,
      model: values.model || null,
      model_year: values.modelYear ? Number(values.modelYear) : null,
      main_feature: values.mainFeature || null,
      description: values.description,
      municipality: values.municipality,
      sector: values.sector || null,
      latitude: values.latitude ? Number(values.latitude) : null,
      longitude: values.longitude ? Number(values.longitude) : null,
      is_available: values.isAvailable,
      publication_status: publicationStatus,
    })
    .select()
    .single();

  if (error) throw new Error(`No se pudo guardar el equipo: ${error.message}`);
  return data;
}

export async function updateEquipment(equipmentId, ownerId, values, publicationStatus) {
  const { data, error } = await supabase
    .from('equipment')
    .update({
      name: values.name,
      category: values.category,
      brand: values.brand || null,
      model: values.model || null,
      model_year: values.modelYear ? Number(values.modelYear) : null,
      main_feature: values.mainFeature || null,
      description: values.description,
      municipality: values.municipality,
      sector: values.sector || null,
      latitude: values.latitude ? Number(values.latitude) : null,
      longitude: values.longitude ? Number(values.longitude) : null,
      is_available: values.isAvailable,
      ...(publicationStatus ? { publication_status: publicationStatus } : {}),
    })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
    .neq('publication_status', 'eliminada')
    .select()
    .single();

  if (error) throw new Error(`No se pudo actualizar el equipo: ${error.message}`);
  return data;
}

export async function loadOwnerEquipment(ownerId) {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, municipality, is_available, publication_status, updated_at')
    .eq('owner_id', ownerId)
    .neq('publication_status', 'eliminada')
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`No se pudieron cargar tus equipos: ${error.message}`);
  return data ?? [];
}

export async function loadPublishedEquipment({ search = '', categories = [], availableOnly = false } = {}) {
  let query = supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, latitude, longitude, is_available, publication_status, created_at, equipment_images(id, storage_path, display_order, is_cover), reviews(rating, review_type, is_published)')
    .eq('publication_status', 'publicada')

  if (categories.length) query = query.in('category', categories);
  if (availableOnly) query = query.eq('is_available', true);
  if (search.trim()) {
    const term = search.trim().replace(/[,%()]/g, ' ');
    query = query.or(`name.ilike.%${term}%,category.ilike.%${term}%,brand.ilike.%${term}%,model.ilike.%${term}%,municipality.ilike.%${term}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);
  return (data ?? []).map((item) => {
    const images = [...(item.equipment_images ?? [])].sort((first, second) => (
      Number(second.is_cover) - Number(first.is_cover) || first.display_order - second.display_order
    ));
    const reviews = (item.reviews ?? []).filter((review) => review.is_published && review.review_type === 'equipo');
    return {
      ...item,
      image: images[0] ? imageUrl(images[0].storage_path) : null,
      rating: reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : null,
    };
  });
}

export async function loadFeaturedEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, municipality, is_available, publication_status, reviews(rating, review_type, is_published)')
    .eq('publication_status', 'publicada')
    .eq('is_available', true);

  if (error) throw new Error(`No se pudieron cargar los equipos destacados: ${error.message}`);

  const featured = (data ?? [])
    .map((item) => {
      const reviews = (item.reviews ?? []).filter((review) => review.is_published && review.review_type === 'equipo');
      const rating = reviews.length
        ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        : 0;
      return { ...item, rating };
    })
    .sort((first, second) => second.rating - first.rating || first.name.localeCompare(second.name))
    .slice(0, 3);
  const coverImages = await loadEquipmentCoverImages(featured.map((item) => item.id));
  return featured.map((item) => ({ ...item, image: coverImages.get(item.id) ?? null }));
}

export async function loadEquipmentById(equipmentId) {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, latitude, longitude, is_available, publication_status, owner_id, reviews(id, rating, comment, highlighted_aspects, review_type, is_published, created_at)')
    .eq('id', equipmentId)
    .eq('publication_status', 'publicada')
    .single();

  if (error) throw new Error(`No se pudo cargar el equipo: ${error.message}`);
  return data;
}

export async function loadEquipmentOwner(ownerId) {
  return loadPublicEquipmentOwner(ownerId);
}

export async function loadOwnerEquipmentById(equipmentId, ownerId, { includeEliminated = false } = {}) {
  let query = supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, latitude, longitude, is_available, publication_status')
    .eq('id', equipmentId)
    .eq('owner_id', ownerId);
  if (!includeEliminated) query = query.neq('publication_status', 'eliminada');
  const { data, error } = await query.single();

  if (error) throw new Error(`No se pudo cargar el equipo: ${error.message}`);
  return data;
}

export async function updateEquipmentAvailability(equipmentId, ownerId, isAvailable) {
  const { data, error } = await supabase
    .from('equipment')
    .update({ is_available: isAvailable })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
    .neq('publication_status', 'eliminada')
    .select('id, is_available, updated_at')
    .single();

  if (error) throw new Error(`No se pudo actualizar la disponibilidad: ${error.message}`);
  return data;
}

export async function updateEquipmentPublication(equipmentId, ownerId, publicationStatus) {
  const { data, error } = await supabase
    .from('equipment')
    .update({ publication_status: publicationStatus })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
    .neq('publication_status', 'eliminada')
    .select('id, publication_status, updated_at')
    .single();

  if (error) throw new Error(`No se pudo actualizar la publicación: ${error.message}`);
  return data;
}

export async function deleteEquipment(equipmentId, ownerId) {
  const { data: images, error: imagesError } = await supabase
    .from('equipment_images')
    .select('storage_path')
    .eq('equipment_id', equipmentId);

  if (imagesError) throw new Error(`No se pudieron preparar las imágenes para eliminarlas: ${imagesError.message}`);

  const { data: archived, error: archiveError } = await supabase
    .from('equipment')
    .update({ publication_status: 'eliminada' })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
    .select('id')
    .maybeSingle();

  if (archiveError) throw new Error(`No se pudo retirar el equipo: ${archiveError.message}`);
  if (!archived) throw new Error('No se encontró el equipo o no tienes permiso para eliminarlo.');

  const paths = (images ?? []).map((image) => image.storage_path);
  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from('equipment-images')
      .remove(paths);

    if (storageError) throw new Error(`La publicación se retiró del catálogo, pero no se pudieron eliminar las fotos: ${storageError.message}`);
  }

  const { error: imageRowsError } = await supabase
    .from('equipment_images')
    .delete()
    .eq('equipment_id', equipmentId);

  if (imageRowsError) {
    throw new Error(`La publicación se retiró del catálogo, pero no se pudieron limpiar los registros de fotos: ${imageRowsError.message}`);
  }
}
