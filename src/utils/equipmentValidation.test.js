import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEquipmentData } from './equipmentValidation.js';

const validEquipment = {
  name: 'Tractor',
  category: 'Tractor',
  description: 'Equipo listo',
  municipality: 'Yopal',
  year: '',
  hasImages: true,
  isDraft: false,
};

test('rejects a description shorter than the database minimum with actionable guidance', () => {
  const result = validateEquipmentData({ ...validEquipment, description: 'Muy corto' });

  assert.equal(result.errors.descripcion, 'La descripción debe tener al menos 10 caracteres. Añade detalles sobre el equipo antes de continuar.');
  assert.equal(result.summary, 'Corrige los campos indicados antes de publicar.');
});

test('accepts the minimum description length after trimming surrounding whitespace', () => {
  const result = validateEquipmentData({ ...validEquipment, description: '  1234567890  ' });

  assert.equal(result.errors.descripcion, undefined);
});

test('requires database-required details for a draft but does not require photos', () => {
  const result = validateEquipmentData({
    ...validEquipment,
    description: 'Corto',
    hasImages: false,
    isDraft: true,
  });

  assert.ok(result.errors.descripcion);
  assert.equal(result.errors.fotos, undefined);
  assert.equal(result.summary, 'Completa los datos obligatorios para guardar el borrador.');
});

test('rejects descriptions longer than the database limit', () => {
  const result = validateEquipmentData({ ...validEquipment, description: 'x'.repeat(3001) });

  assert.equal(result.errors.descripcion, 'La descripción no puede superar los 3000 caracteres.');
});
