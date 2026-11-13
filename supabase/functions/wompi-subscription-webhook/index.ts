import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWompiEvent } from '../_shared/wompi.js';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return jsonResponse({ error: 'Método no permitido.' }, 405);

  try {
    const eventsSecret = Deno.env.get('WOMPI_EVENTS_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!eventsSecret || !supabaseUrl || !serviceRoleKey) {
      console.error('Falta configurar el webhook de Wompi.');
      return jsonResponse({ error: 'Webhook no configurado.' }, 503);
    }

    const rawBody = await request.text();
    if (rawBody.length > 65536) return jsonResponse({ error: 'Evento demasiado grande.' }, 413);
    const event = JSON.parse(rawBody);
    if (!await verifyWompiEvent(event, eventsSecret)) {
      return jsonResponse({ error: 'Firma de evento no válida.' }, 401);
    }
    if (event.event !== 'transaction.updated') {
      return jsonResponse({ received: true, ignored: true });
    }

    const transaction = event.data?.transaction;
    if (
      !transaction
      || typeof transaction.reference !== 'string'
      || typeof transaction.id !== 'string'
      || !Number.isSafeInteger(transaction.amount_in_cents)
      || typeof transaction.currency !== 'string'
      || typeof transaction.status !== 'string'
      || !['test', 'prod'].includes(event.environment)
    ) {
      return jsonResponse({ error: 'Evento de transacción incompleto.' }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await serviceClient.rpc('apply_wompi_subscription_payment', {
      p_reference: transaction.reference,
      p_transaction_id: transaction.id,
      p_amount_in_cents: transaction.amount_in_cents,
      p_currency: transaction.currency,
      p_status: transaction.status,
      p_environment: event.environment,
    });

    if (error) {
      console.error('No se pudo aplicar el evento de pago de Wompi.', error);
      return jsonResponse({ error: 'No se pudo procesar el pago.' }, 500);
    }

    return jsonResponse({ received: true, status: data });
  } catch (error) {
    console.error('Falló el procesamiento del webhook de Wompi.', error);
    return jsonResponse({ error: 'No se pudo procesar el evento.' }, 500);
  }
});
