import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { toUserFacingError } from './userFacingError.js';

const originalConsoleError = console.error;
console.error = () => {};
after(() => {
  console.error = originalConsoleError;
});

test('translates a short equipment description constraint into a clear instruction', () => {
  const error = toUserFacingError({
    code: '23514',
    constraint: 'equipment_description_length',
    message: 'new row violates check constraint equipment_description_length',
  }, 'No se pudo guardar el equipo.');

  assert.equal(error.message, 'La descripción debe tener entre 10 y 3000 caracteres.');
});

test('does not expose raw database errors when no known translation exists', () => {
  const error = toUserFacingError({
    code: 'XX000',
    message: 'relation public.vehicle does not exist',
  }, 'No se pudo cargar el catálogo. Inténtalo nuevamente.');

  assert.equal(error.message, 'No se pudo cargar el catálogo. Inténtalo nuevamente.');
  assert.doesNotMatch(error.message, /public\.vehicle|relation/i);
});

test('preserves actionable validation messages raised by the application', () => {
  const error = toUserFacingError({
    code: 'P0001',
    message: 'No tienes permiso para resolver apelaciones',
  }, 'No se pudo completar la acción.');

  assert.equal(error.message, 'No tienes permiso para resolver apelaciones');
});

test('hides an unrecognized database exception behind the operation fallback', () => {
  const error = toUserFacingError({
    code: 'P0001',
    message: 'column vehicle.description has invalid length',
  }, 'No se pudo guardar el equipo.');

  assert.equal(error.message, 'No se pudo guardar el equipo.');
});
