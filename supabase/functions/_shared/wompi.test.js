import assert from 'node:assert/strict';
import test from 'node:test';
import { copToWompiCents, createWompiIntegritySignature, verifyWompiEvent } from './wompi.js';

test('converts whole COP pesos to the cents Wompi expects', () => {
  assert.equal(copToWompiCents(125000), 12500000);
  assert.throws(() => copToWompiCents(1.25));
  assert.throws(() => copToWompiCents(0));
});

test('creates an integrity signature including the optional expiration', async () => {
  const signature = await createWompiIntegritySignature({
    reference: 'RNT123',
    amountInCents: 12500000,
    expirationTime: '2026-11-12T20:00:00.000Z',
    integritySecret: 'test-integrity-secret',
  });
  const expectedInput = 'RNT12312500000COP2026-11-12T20:00:00.000Ztest-integrity-secret';
  const expectedDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(expectedInput));
  const expectedSignature = [...new Uint8Array(expectedDigest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  assert.equal(signature, expectedSignature);
  assert.notEqual(signature, await createWompiIntegritySignature({
    reference: 'RNT123',
    amountInCents: 12500000,
    integritySecret: 'test-integrity-secret',
  }));
});

test('accepts a correctly signed Wompi event and rejects modified data', async () => {
  const secret = 'local-test-events-secret';
  const event = {
    data: { transaction: { id: 'tx-1', status: 'APPROVED', amount_in_cents: 12500000 } },
    timestamp: 1794513600,
    signature: { properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'], checksum: '' },
  };
  const signedValue = `${event.data.transaction.id}${event.data.transaction.status}${event.data.transaction.amount_in_cents}${event.timestamp}${secret}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signedValue));
  event.signature.checksum = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

  assert.equal(await verifyWompiEvent(event, secret), true);
  event.data.transaction.amount_in_cents += 100;
  assert.equal(await verifyWompiEvent(event, secret), false);
});
