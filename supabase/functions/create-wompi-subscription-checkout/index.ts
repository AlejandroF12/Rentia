import { createClient } from 'npm:@supabase/supabase-js@2';
import { copToWompiCents, createWompiIntegritySignature } from '../_shared/wompi.js';

const SUBSCRIPTION_TERMS_VERSION = 'subscription-2026-11-v1';

function getAllowedOrigins() {
  return (Deno.env.get('APP_ALLOWED_ORIGINS') || Deno.env.get('APP_BASE_URL') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null) {
  const allowedOrigins = getAllowedOrigins();
  if (!origin || !allowedOrigins.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin);
  if (!cors) return jsonResponse({ error: 'Origen no autorizado.' }, 403, {});
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return jsonResponse({ error: 'Método no permitido.' }, 405, cors);

  try {
    const requestBody = await request.json();
    if (
      requestBody?.termsAccepted !== true
      || requestBody?.termsVersion !== SUBSCRIPTION_TERMS_VERSION
    ) {
      return jsonResponse({ error: 'Debes aceptar las condiciones vigentes de la suscripción.' }, 400, cors);
    }

    const authorization = request.headers.get('authorization');
    const token = authorization?.replace(/^Bearer\s+/i, '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const publicKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!token || !supabaseUrl || !publicKey || !serviceRoleKey) {
      return jsonResponse({ error: 'El servicio de pagos no está configurado.' }, 503, cors);
    }

    const userClient = createClient(supabaseUrl, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser(token);
    if (userError || !userData.user) {
      return jsonResponse({ error: 'Inicia sesión para renovar tu suscripción.' }, 401, cors);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const [{ data: profile, error: profileError }, { data: settings, error: settingsError }] = await Promise.all([
      serviceClient
        .from('profiles')
        .select('id, role, status')
        .eq('id', userData.user.id)
        .maybeSingle(),
      serviceClient
        .from('subscription_settings')
        .select('monthly_price_cop, payment_provider, checkout_enabled')
        .eq('id', 1)
        .single(),
    ]);

    if (profileError || settingsError) {
      console.error('No se pudo consultar la configuración del checkout.', profileError || settingsError);
      return jsonResponse({ error: 'No se pudo preparar el pago. Inténtalo más tarde.' }, 500, cors);
    }
    if (!profile || profile.role !== 'arrendador' || profile.status !== 'activo') {
      return jsonResponse({ error: 'Solo un arrendador con cuenta activa puede renovar.' }, 403, cors);
    }
    if (!settings.checkout_enabled || Deno.env.get('WOMPI_PAYMENTS_ENABLED') !== 'true') {
      return jsonResponse({ error: 'Los pagos de suscripción todavía no están habilitados.' }, 409, cors);
    }
    if (settings.payment_provider !== 'wompi') {
      return jsonResponse({ error: 'El proveedor de pagos no está configurado.' }, 503, cors);
    }

    const environment = Deno.env.get('WOMPI_ENVIRONMENT');
    const wompiPublicKey = Deno.env.get('WOMPI_PUBLIC_KEY');
    const integritySecret = Deno.env.get('WOMPI_INTEGRITY_SECRET');
    const baseUrl = Deno.env.get('APP_BASE_URL');
    const expectedKeyPrefix = environment === 'test' ? 'pub_test_' : environment === 'prod' ? 'pub_prod_' : '';
    let appUrl: URL | null = null;
    try {
      appUrl = baseUrl ? new URL(baseUrl) : null;
    } catch {
      appUrl = null;
    }
    const isLocalTestUrl = environment === 'test'
      && appUrl !== null
      && ['localhost', '127.0.0.1'].includes(appUrl.hostname);
    if (
      !expectedKeyPrefix
      || !wompiPublicKey?.startsWith(expectedKeyPrefix)
      || !integritySecret
      || !appUrl
      || (appUrl.protocol !== 'https:' && !isLocalTestUrl)
      || !getAllowedOrigins().includes(appUrl.origin)
    ) {
      console.error('Falta configuración segura para generar un checkout de Wompi.');
      return jsonResponse({ error: 'El checkout todavía no está listo. Contacta al equipo de Rentia.' }, 503, cors);
    }

    const amountCop = Number(settings.monthly_price_cop);
    const amountInCents = copToWompiCents(amountCop);
    const reference = `RNT${crypto.randomUUID().replaceAll('-', '').toUpperCase()}`;
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const redirectUrl = new URL('/arrendador/suscripcion', appUrl).toString();
    const signature = await createWompiIntegritySignature({
      reference,
      amountInCents,
      expirationTime,
      integritySecret,
    });

    const { error: insertError } = await serviceClient
      .from('landlord_subscription_payments')
      .insert({
        landlord_id: profile.id,
        provider: 'wompi',
        provider_environment: environment,
        reference,
        subscription_terms_version: SUBSCRIPTION_TERMS_VERSION,
        subscription_terms_accepted_at: new Date().toISOString(),
        amount_in_cents: amountInCents,
        currency: 'COP',
        expires_at: expirationTime,
        status: 'checkout_created',
      });

    if (insertError) {
      console.error('No se pudo registrar el intento de pago.', insertError);
      return jsonResponse({ error: 'No se pudo iniciar el pago. Inténtalo nuevamente.' }, 500, cors);
    }

    return jsonResponse({
      publicKey: wompiPublicKey,
      amountInCents,
      currency: 'COP',
      reference,
      signature,
      expirationTime,
      redirectUrl,
    }, 200, cors);
  } catch (error) {
    console.error('Falló la creación del checkout de suscripción.', error);
    return jsonResponse({ error: 'No se pudo iniciar el pago. Inténtalo nuevamente.' }, 500, cors);
  }
});
