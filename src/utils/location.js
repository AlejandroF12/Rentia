export const MUNICIPALITY_COORDINATES = {
  Yopal: [5.33775, -72.39586],
  Aguazul: [5.17282, -72.54706],
  Tauramena: [5.0158, -72.75398],
  Villanueva: [4.60917, -72.9275],
};

export function getMunicipalityCoordinates(municipality) {
  const key = municipality?.split(',')[0];
  return MUNICIPALITY_COORDINATES[key] || MUNICIPALITY_COORDINATES.Yopal;
}

export function normalizeLocationText(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
