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
