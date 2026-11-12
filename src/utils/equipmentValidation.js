export function validateEquipmentData({ name, category, description, municipality, year, hasImages, isDraft }) {
  const errors = {};
  const nameLength = [...String(name || '').trim()].length;
  const descriptionLength = [...String(description || '').trim()].length;
  const modelYear = String(year || '').trim();

  if (nameLength < 2) errors.nombre = 'El nombre del equipo debe tener al menos 2 caracteres.';
  else if (nameLength > 160) errors.nombre = 'El nombre del equipo no puede superar los 160 caracteres.';
  if (!category) errors.categoria = 'Selecciona una categoría.';
  if (descriptionLength < 10) errors.descripcion = 'La descripción debe tener al menos 10 caracteres. Añade detalles sobre el equipo antes de continuar.';
  else if (descriptionLength > 3000) errors.descripcion = 'La descripción no puede superar los 3000 caracteres.';
  if (modelYear && (!/^\d{4}$/.test(modelYear) || Number(modelYear) < 1900 || Number(modelYear) > 2100)) {
    errors.anio = 'Ingresa un año válido entre 1900 y 2100.';
  }
  if (!String(municipality || '').trim()) errors.municipio = 'Ingresa el municipio del equipo.';
  if (!isDraft && !hasImages) errors.fotos = 'Agrega al menos una foto del equipo para publicarlo.';

  return {
    errors,
    summary: Object.keys(errors).length
      ? isDraft
        ? 'Completa los datos obligatorios para guardar el borrador.'
        : 'Corrige los campos indicados antes de publicar.'
      : '',
  };
}
