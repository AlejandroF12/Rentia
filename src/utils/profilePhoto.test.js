import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProfilePhoto } from './profilePhoto.js';

test('accepts supported image types up to the configured size limit', () => {
  assert.equal(validateProfilePhoto({ type: 'image/jpeg', size: 5 * 1024 * 1024 }), 'jpg');
  assert.equal(validateProfilePhoto({ type: 'image/png', size: 1024 }), 'png');
  assert.equal(validateProfilePhoto({ type: 'image/webp', size: 1024 }), 'webp');
});

test('rejects unsupported image types', () => {
  assert.throws(() => validateProfilePhoto({ type: 'image/gif', size: 1024 }), /JPG, PNG o WebP/);
});

test('rejects empty or oversized photos', () => {
  assert.throws(() => validateProfilePhoto({ type: 'image/jpeg', size: 0 }), /máximo 5 MB/);
  assert.throws(() => validateProfilePhoto({ type: 'image/jpeg', size: 5 * 1024 * 1024 + 1 }), /máximo 5 MB/);
});
