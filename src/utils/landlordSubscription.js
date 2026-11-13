const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseDate(value, label) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`La fecha ${label} de la suscripción no es válida.`);
  }
  return timestamp;
}

export function getLandlordSubscriptionSummary({
  profileCreatedAt,
  launchAt,
  trialDays,
  paidThroughAt,
  monthlyPriceCop,
  paymentProvider,
  renewalEnabled,
  checkoutEnabled,
}, now = Date.now()) {
  if (!Number.isInteger(trialDays) || trialDays < 1) {
    throw new Error('La duración de prueba configurada no es válida.');
  }

  const trialStartedAt = Math.max(
    parseDate(profileCreatedAt, 'de creación de cuenta'),
    parseDate(launchAt, 'de lanzamiento'),
  );
  const trialEndsAt = trialStartedAt + trialDays * DAY_IN_MS;
  const paidThrough = paidThroughAt ? parseDate(paidThroughAt, 'de vencimiento') : 0;
  const endsAt = Math.max(trialEndsAt, paidThrough);
  const status = paidThrough > now && paidThrough > trialEndsAt
    ? 'activa'
    : trialEndsAt > now
      ? 'prueba'
      : paidThrough > now
        ? 'activa'
        : 'vencida';
  const remainingMs = Math.max(0, endsAt - now);
  const price = monthlyPriceCop === null || monthlyPriceCop === undefined
    ? null
    : Number(monthlyPriceCop);

  return {
    status,
    isActive: endsAt > now,
    trialStartedAt: new Date(trialStartedAt).toISOString(),
    trialEndsAt: new Date(trialEndsAt).toISOString(),
    endsAt: new Date(endsAt).toISOString(),
    remainingDays: Math.ceil(remainingMs / DAY_IN_MS),
    monthlyPriceCop: Number.isFinite(price) ? price : null,
    paymentProvider: paymentProvider || null,
    renewalAvailable: renewalEnabled === true
      && Number.isFinite(price)
      && price > 0
      && Boolean(paymentProvider),
    checkoutAvailable: checkoutEnabled === true
      && Number.isFinite(price)
      && price > 0
      && paymentProvider === 'wompi',
  };
}
