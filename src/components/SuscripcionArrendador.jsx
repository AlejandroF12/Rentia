import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import { useAuth } from '../context/AuthContext';
import {
  createSubscriptionCheckout,
  loadLandlordSubscription,
  loadLandlordSubscriptionPayments,
} from '../services/subscriptionService';

const labels = {
  prueba: { text: 'Prueba gratuita', tone: 'success' },
  activa: { text: 'Suscripción activa', tone: 'success' },
  vencida: { text: 'Suscripción vencida', tone: 'danger' },
};

const paymentLabels = {
  checkout_created: { text: 'Checkout iniciado', tone: 'neutral' },
  expired: { text: 'Checkout vencido', tone: 'neutral' },
  pending: { text: 'Pago pendiente', tone: 'warning' },
  approved: { text: 'Pago aprobado', tone: 'success' },
  declined: { text: 'Pago rechazado', tone: 'danger' },
  voided: { text: 'Pago anulado', tone: 'neutral' },
  error: { text: 'Error en el pago', tone: 'danger' },
};

const formatCop = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(value);

function decoratePayments(payments) {
  const now = Date.now();
  return payments.map((payment) => ({
    ...payment,
    displayStatus: payment.status === 'checkout_created' && Date.parse(payment.expires_at) <= now
      ? 'expired'
      : payment.status,
  }));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SuscripcionArrendador({ className = '' }) {
  const { profile } = useAuth();
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [returnedPayment, setReturnedPayment] = useState(null);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingCheckout, setStartingCheckout] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const transactionId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    let active = true;
    Promise.all([
      loadLandlordSubscription(profile.id, profile.created_at),
      loadLandlordSubscriptionPayments(profile.id),
    ])
      .then(([subscription, recentPayments]) => {
        if (active) {
          setSummary(subscription);
          setPayments(decoratePayments(recentPayments));
          const matchingPayment = transactionId
            ? recentPayments.find((payment) => payment.provider_transaction_id === transactionId)
            : null;
          setReturnedPayment(matchingPayment || (transactionId ? { status: 'pending' } : null));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [profile.id, profile.created_at, transactionId]);

  async function refreshPaymentStatus() {
    setPaymentError('');
    setRefreshing(true);
    try {
      const recentPayments = await loadLandlordSubscriptionPayments(profile.id);
      setPayments(decoratePayments(recentPayments));
      const matchingPayment = transactionId
        ? recentPayments.find((payment) => payment.provider_transaction_id === transactionId)
        : null;
      setReturnedPayment(matchingPayment || (transactionId ? { status: 'pending' } : null));
      setSummary(await loadLandlordSubscription(profile.id, profile.created_at));
    } catch (refreshError) {
      setPaymentError(refreshError.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function startCheckout() {
    setPaymentError('');
    setStartingCheckout(true);
    try {
      const checkout = await createSubscriptionCheckout(termsAccepted);
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = 'https://checkout.wompi.co/p/';
      form.hidden = true;

      const fields = {
        'public-key': checkout.publicKey,
        currency: checkout.currency,
        'amount-in-cents': String(checkout.amountInCents),
        reference: checkout.reference,
        'signature:integrity': checkout.signature,
        'redirect-url': checkout.redirectUrl,
        'expiration-time': checkout.expirationTime,
      };
      for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.append(input);
      }

      document.body.append(form);
      form.submit();
    } catch (checkoutError) {
      setPaymentError(checkoutError.message);
      setStartingCheckout(false);
    }
  }

  return (
    <Card className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-heading-md font-semibold text-text">Mi suscripción</h2>
        {summary && <Badge tone={labels[summary.status].tone}>{labels[summary.status].text}</Badge>}
      </div>

      {loading ? (
        <p className="mt-4 text-small text-text-muted" aria-busy="true">Consultando tu suscripción…</p>
      ) : error ? (
        <p role="alert" className="mt-4 text-small text-danger">{error}</p>
      ) : (
        <>
          {summary.status === 'vencida' ? (
            <p className="mt-4 text-body text-text-muted">
              Tu suscripción venció el {formatDate(summary.endsAt)}. Las funciones de arrendador están pausadas hasta que renueves.
            </p>
          ) : (
            <p className="mt-4 text-body text-text-muted">
              {summary.status === 'prueba' ? 'Te quedan' : 'Tu próximo vencimiento es en'}{' '}
              <strong className="text-text">{summary.remainingDays} día{summary.remainingDays === 1 ? '' : 's'}</strong>
              {' '}({formatDate(summary.endsAt)}).
            </p>
          )}
          <div className="mt-5 rounded-xl border border-border bg-surface-muted p-4">
            <p className="text-label font-semibold text-text">
              Plan mensual: {summary.monthlyPriceCop ? formatCop(summary.monthlyPriceCop) : 'Precio por definir'}
            </p>
            <p className="mt-1 text-small text-text-muted">
              Un pago extiende el acceso a la plataforma por un mes. No hay cobros automáticos.
            </p>
            {summary.checkoutAvailable ? (
              <>
                <Checkbox
                  id="aceptar-condiciones-suscripcion"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  className="mt-4"
                >
                  Acepto las <Link to="/terminos#suscripcion" className="font-semibold text-primary underline">condiciones de la suscripción</Link> y confirmo el plan mensual de {formatCop(summary.monthlyPriceCop)} sin renovación automática.
                </Checkbox>
                <Button
                  type="button"
                  size="lg"
                  className="mt-4"
                  disabled={startingCheckout || !termsAccepted}
                  onClick={startCheckout}
                >
                  {startingCheckout ? 'Preparando pago…' : `Pagar ${formatCop(summary.monthlyPriceCop)}`}
                </Button>
              </>
            ) : (
              <Button type="button" size="lg" className="mt-4" disabled>
                Pagos temporalmente deshabilitados
              </Button>
            )}
            {!summary.checkoutAvailable && (
              <p className="mt-3 text-small text-text-muted">
                La renovación todavía no está habilitada. No se iniciará ningún cobro mientras Rentia termina de configurar la recepción de pagos.
              </p>
            )}
            {paymentError && <p role="alert" className="mt-3 text-small text-danger">{paymentError}</p>}
          </div>
          {returnedPayment && (
            <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-border p-4">
              <h3 className="text-label font-semibold text-text">Resultado de tu pago</h3>
              {returnedPayment.status === 'pending' && !returnedPayment.provider_transaction_id ? (
                <p className="mt-2 text-small text-text-muted">
                  Regresaste del proceso de pago. Rentia activará el mes únicamente cuando Wompi confirme el pago.
                </p>
              ) : (
                <p className="mt-2 text-small text-text-muted">
                  {paymentLabels[returnedPayment.status]?.text || 'Estado pendiente de confirmar'}
                  {returnedPayment.period_end_at ? ` · acceso hasta ${formatDate(returnedPayment.period_end_at)}` : ''}
                </p>
              )}
              <Button type="button" variant="secondary" className="mt-3" disabled={refreshing} onClick={refreshPaymentStatus}>
                {refreshing ? 'Consultando…' : 'Actualizar estado'}
              </Button>
            </div>
          )}
          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-label font-semibold text-text">Pagos recientes</h3>
              <Button type="button" variant="secondary" disabled={refreshing} onClick={refreshPaymentStatus}>
                {refreshing ? 'Actualizando…' : 'Actualizar'}
              </Button>
            </div>
            {payments.length ? (
              <ul className="mt-3 divide-y divide-border">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-small font-medium text-text">{formatCop(payment.amount_in_cents / 100)}</p>
                      <p className="mt-1 text-caption text-text-muted">{formatDate(payment.created_at)}</p>
                    </div>
                    <Badge tone={paymentLabels[
                      payment.displayStatus
                    ]?.tone || 'neutral'}>
                      {paymentLabels[
                        payment.displayStatus
                      ]?.text || payment.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-small text-text-muted">Todavía no tienes pagos de suscripción.</p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
