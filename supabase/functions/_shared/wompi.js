function toHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
}

export function copToWompiCents(amountCop) {
  if (!Number.isSafeInteger(amountCop) || amountCop < 1) {
    throw new Error('El precio en COP debe ser un entero positivo.');
  }
  const cents = amountCop * 100;
  if (!Number.isSafeInteger(cents)) {
    throw new Error('El precio supera el valor admitido por Wompi.');
  }
  return cents;
}

export async function createWompiIntegritySignature({
  reference,
  amountInCents,
  currency = 'COP',
  expirationTime,
  integritySecret,
}) {
  if (!reference || !Number.isSafeInteger(amountInCents) || amountInCents < 1) {
    throw new Error('La referencia y el valor del pago deben ser válidos.');
  }
  if (!integritySecret) {
    throw new Error('Falta configurar el secreto de integridad de Wompi.');
  }
  const expiration = expirationTime || '';
  return sha256(`${reference}${amountInCents}${currency}${expiration}${integritySecret}`);
}

function getNestedValue(value, path) {
  return path.split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object' || !Object.hasOwn(current, key)) return undefined;
    return current[key];
  }, value);
}

function safeEqual(first, second) {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
}

export async function verifyWompiEvent(event, eventsSecret) {
  const properties = event?.signature?.properties;
  const checksum = event?.signature?.checksum;
  const timestamp = event?.timestamp;
  if (
    !eventsSecret
    || !Array.isArray(properties)
    || properties.length === 0
    || properties.length > 30
    || typeof checksum !== 'string'
    || !Number.isSafeInteger(timestamp)
  ) return false;

  const values = [];
  for (const property of properties) {
    if (typeof property !== 'string' || property.length > 200) return false;
    const value = getNestedValue(event.data, property);
    if (value === undefined || value === null || typeof value === 'object') return false;
    values.push(String(value));
  }

  const expected = await sha256(`${values.join('')}${timestamp}${eventsSecret}`);
  return safeEqual(expected.toLowerCase(), checksum.toLowerCase());
}
