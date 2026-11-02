import { supabase } from '../lib/supabaseClient';

export async function createEquipment(ownerId, values) {
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
      is_available: values.isAvailable,
      publication_status: 'publicada',
    })
    .select()
    .single();

  if (error) throw new Error(`No se pudo publicar el equipo: ${error.message}`);
  return data;
}

export async function updateEquipment(equipmentId, ownerId, values) {
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
      is_available: values.isAvailable,
    })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
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
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`No se pudieron cargar tus equipos: ${error.message}`);
  return data ?? [];
}

export async function loadPublishedEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, is_available, publication_status, owner:owner_id(id, full_name, phone, municipality)')
    .eq('publication_status', 'publicada')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);
  return data ?? [];
}

export async function loadFeaturedEquipment() {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, municipality, is_available, publication_status, reviews(rating, is_published)')
    .eq('publication_status', 'publicada')
    .eq('is_available', true);

  if (error) throw new Error(`No se pudieron cargar los equipos destacados: ${error.message}`);

  return (data ?? [])
    .map((item) => {
      const reviews = (item.reviews ?? []).filter((review) => review.is_published);
      const rating = reviews.length
        ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        : 0;
      return { ...item, rating };
    })
    .sort((first, second) => second.rating - first.rating || first.name.localeCompare(second.name))
    .slice(0, 3);
}

export async function loadEquipmentById(equipmentId) {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, latitude, longitude, is_available, publication_status, owner:owner_id(id, full_name, phone, municipality)')
    .eq('id', equipmentId)
    .eq('publication_status', 'publicada')
    .single();

  if (error) throw new Error(`No se pudo cargar el equipo: ${error.message}`);
  return data;
}

export async function loadOwnerEquipmentById(equipmentId, ownerId) {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, name, category, brand, model, model_year, main_feature, description, municipality, sector, is_available, publication_status')
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
    .single();

  if (error) throw new Error(`No se pudo cargar el equipo: ${error.message}`);
  return data;
}

export async function updateEquipmentAvailability(equipmentId, ownerId, isAvailable) {
  const { data, error } = await supabase
    .from('equipment')
    .update({ is_available: isAvailable })
    .eq('id', equipmentId)
    .eq('owner_id', ownerId)
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
    .select('id, publication_status, updated_at')
    .single();

  if (error) throw new Error(`No se pudo actualizar la publicación: ${error.message}`);
  return data;
}

export async function deleteEquipment(equipmentId, ownerId) {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', equipmentId)
    .eq('owner_id', ownerId);

  if (error) throw new Error(`No se pudo eliminar el equipo: ${error.message}`);
}
