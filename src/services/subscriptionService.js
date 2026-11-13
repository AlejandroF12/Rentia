import { supabase } from '../lib/supabaseClient';
import { getLandlordSubscriptionSummary } from '../utils/landlordSubscription';
import { toUserFacingError } from '../utils/userFacingError';

export async function loadLandlordSubscription(landlordId, profileCreatedAt) {
  const [settingsResult, subscriptionResult] = await Promise.all([
    supabase
      .from('subscription_settings')
      .select('launch_at, trial_days, monthly_price_cop, payment_provider, renewal_enabled, checkout_enabled')
      .eq('id', 1)
      .single(),
    supabase
      .from('landlord_subscriptions')
      .select('paid_through_at')
      .eq('landlord_id', landlordId)
      .maybeSingle(),
  ]);

  if (settingsResult.error) {
    throw toUserFacingError(settingsResult.error, 'No se pudo consultar la configuración de la suscripción.');
  }
  if (subscriptionResult.error) {
    throw toUserFacingError(subscriptionResult.error, 'No se pudo consultar el estado de la suscripción.');
  }

  return getLandlordSubscriptionSummary({
    profileCreatedAt,
    launchAt: settingsResult.data.launch_at,
    trialDays: settingsResult.data.trial_days,
    paidThroughAt: subscriptionResult.data?.paid_through_at,
    monthlyPriceCop: settingsResult.data.monthly_price_cop,
    paymentProvider: settingsResult.data.payment_provider,
    renewalEnabled: settingsResult.data.renewal_enabled,
    checkoutEnabled: settingsResult.data.checkout_enabled,
  });
}

export async function createSubscriptionCheckout(termsAccepted) {
  const { data, error } = await supabase.functions.invoke('create-wompi-subscription-checkout', {
    method: 'POST',
    body: {
      termsAccepted,
      termsVersion: 'subscription-2026-11-v1',
    },
  });

  if (error) {
    throw toUserFacingError(error, 'No se pudo iniciar el pago. Inténtalo nuevamente.');
  }
  if (
    !data
    || typeof data.publicKey !== 'string'
    || !/^pub_(test|prod)_/.test(data.publicKey)
    || typeof data.reference !== 'string'
    || !Number.isSafeInteger(data.amountInCents)
    || data.currency !== 'COP'
    || typeof data.signature !== 'string'
    || typeof data.expirationTime !== 'string'
    || typeof data.redirectUrl !== 'string'
  ) {
    throw new Error('El servicio de pago devolvió una respuesta incompleta.');
  }
  return data;
}

export async function loadLandlordSubscriptionPayments(landlordId) {
  const { data, error } = await supabase
    .from('landlord_subscription_payments')
    .select('id, reference, provider_transaction_id, amount_in_cents, currency, status, paid_at, created_at, expires_at, period_end_at')
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw toUserFacingError(error, 'No se pudo consultar el historial de pagos.');
  }
  return data ?? [];
}
