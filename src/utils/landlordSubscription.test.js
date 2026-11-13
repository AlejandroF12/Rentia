import assert from 'node:assert/strict';
import test from 'node:test';
import { getLandlordSubscriptionSummary } from './landlordSubscription.js';

const launchAt = '2026-11-12T00:00:00.000Z';

test('starts existing landlords trial at program launch', () => {
  const summary = getLandlordSubscriptionSummary({
    profileCreatedAt: '2025-01-01T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    monthlyPriceCop: null,
    paymentProvider: null,
    renewalEnabled: false,
  }, Date.parse('2026-11-20T00:00:00.000Z'));

  assert.equal(summary.status, 'prueba');
  assert.equal(summary.remainingDays, 22);
  assert.equal(summary.trialStartedAt, launchAt);
});

test('starts new landlords trial from account creation', () => {
  const summary = getLandlordSubscriptionSummary({
    profileCreatedAt: '2026-11-20T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    monthlyPriceCop: null,
    paymentProvider: null,
    renewalEnabled: false,
  }, Date.parse('2026-11-22T00:00:00.000Z'));

  assert.equal(summary.trialStartedAt, '2026-11-20T00:00:00.000Z');
  assert.equal(summary.remainingDays, 28);
});

test('marks the subscription expired after the trial without renewal', () => {
  const summary = getLandlordSubscriptionSummary({
    profileCreatedAt: '2025-01-01T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    monthlyPriceCop: null,
    paymentProvider: null,
    renewalEnabled: false,
  }, Date.parse('2026-12-13T00:00:00.000Z'));

  assert.equal(summary.status, 'vencida');
  assert.equal(summary.isActive, false);
  assert.equal(summary.remainingDays, 0);
});

test('uses a paid period that extends beyond the trial', () => {
  const summary = getLandlordSubscriptionSummary({
    profileCreatedAt: '2025-01-01T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    paidThroughAt: '2027-01-15T00:00:00.000Z',
    monthlyPriceCop: 50000,
    paymentProvider: 'wompi',
    renewalEnabled: true,
  }, Date.parse('2026-12-20T00:00:00.000Z'));

  assert.equal(summary.status, 'activa');
  assert.equal(summary.isActive, true);
  assert.equal(summary.renewalAvailable, true);
});

test('shows a fixed monthly checkout only when it is explicitly enabled', () => {
  const disabled = getLandlordSubscriptionSummary({
    profileCreatedAt: '2025-01-01T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    monthlyPriceCop: 125000,
    paymentProvider: 'wompi',
    renewalEnabled: false,
    checkoutEnabled: false,
  }, Date.parse('2026-12-20T00:00:00.000Z'));

  const enabled = getLandlordSubscriptionSummary({
    profileCreatedAt: '2025-01-01T00:00:00.000Z',
    launchAt,
    trialDays: 30,
    monthlyPriceCop: 125000,
    paymentProvider: 'wompi',
    renewalEnabled: false,
    checkoutEnabled: true,
  }, Date.parse('2026-12-20T00:00:00.000Z'));

  assert.equal(disabled.monthlyPriceCop, 125000);
  assert.equal(disabled.checkoutAvailable, false);
  assert.equal(enabled.checkoutAvailable, true);
  assert.equal(enabled.renewalAvailable, false);
});
