const CONSTRAINT_MESSAGES = {
  equipment_name_length: 'El nombre del equipo debe tener entre 2 y 160 caracteres.',
  equipment_description_length: 'La descripción debe tener entre 10 y 3000 caracteres.',
  equipment_model_year_valid: 'El año debe estar entre 1900 y 2100.',
  equipment_coordinates_pair: 'Selecciona una ubicación completa para el equipo.',
  equipment_latitude_valid: 'La ubicación del equipo no es válida. Selecciona un punto en el mapa.',
  equipment_longitude_valid: 'La ubicación del equipo no es válida. Selecciona un punto en el mapa.',
  profiles_full_name_length: 'El nombre debe tener entre 2 y 120 caracteres.',
  profiles_phone_length: 'El teléfono debe tener entre 7 y 30 caracteres.',
  profiles_avatar_path_owned: 'La foto de perfil no pertenece a esta cuenta.',
  reviews_rating_valid: 'Selecciona una puntuación entre 1 y 5 estrellas.',
  reviews_participants_differ: 'No puedes publicar una valoración para tu propia cuenta.',
  reports_description_length: 'La explicación del reporte no puede superar los 500 caracteres.',
  account_appeals_reason_length: 'El motivo debe tener entre 3 y 100 caracteres.',
  account_appeals_description_length: 'La explicación debe tener entre 30 y 2000 caracteres.',
  account_appeals_decision_note_length: 'La respuesta debe tener como máximo 2000 caracteres.',
};

const FIELD_MESSAGES = [
  [/description|descripcion/i, 'El texto ingresado supera la longitud permitida. Revisa la descripción e inténtalo de nuevo.'],
  [/full_name|nombre/i, 'Revisa que el nombre tenga entre 2 y 120 caracteres.'],
  [/phone|telefono|teléfono/i, 'Revisa que el teléfono tenga entre 7 y 30 caracteres.'],
  [/model_year|anio|año/i, 'El año debe ser un número entre 1900 y 2100.'],
];

const APPLICATION_MESSAGES = new Set([
  'Un equipo no puede tener más de 8 imágenes',
  'No tienes permiso para cambiar el rol',
  'Solo administración puede cambiar el estado o el motivo de suspensión de una cuenta',
  'No tienes permiso para resolver apelaciones',
  'La decisión de apelación no es válida',
  'La nota de decisión debe tener entre 10 y 2000 caracteres',
  'No se encontró la apelación',
  'La apelación ya fue resuelta',
  'La cuenta ya no está suspendida y no se puede reactivar con esta apelación',
  'Solo administración puede cambiar el estado de una publicación suspendida o eliminada',
  'Solo administración puede cambiar la visibilidad de una valoración',
  'Una valoración oculta por moderación no puede ser eliminada por su autor',
  'Solo puedes publicar una valoración en nombre de tu propia cuenta.',
  'La valoración necesita cuentas activas y un equipo válido.',
  'Un cliente solo puede valorar al arrendador o al equipo que pertenece a ese arrendador.',
  'Un arrendador solo puede valorar a un cliente en un equipo propio.',
  'El cliente debe publicar primero una valoración visible sobre ti.',
  'Solo clientes y arrendadores pueden publicar valoraciones.',
  'No puedes cambiar los participantes, el equipo ni el tipo de una valoración; edita su contenido.',
]);

export function toUserFacingError(error, fallback) {
  const message = error?.message || String(error || '');
  const errorCode = error?.code || error?.name;
  const constraint = error?.constraint
    || message.match(/constraint ["']?([a-z0-9_]+)["']?/i)?.[1];
  const constraintMessage = CONSTRAINT_MESSAGES[constraint];

  console.error('Error de operación en Rentia:', error);

  if (errorCode === 'invalid_credentials' || /invalid login credentials/i.test(message)) {
    return new Error('El correo o la contraseña no son correctos.');
  }
  if (errorCode === 'email_not_confirmed' || /email not confirmed/i.test(message)) {
    return new Error('Confirma tu correo electrónico desde el enlace que te enviamos antes de iniciar sesión.');
  }
  if (errorCode === 'user_already_exists' || errorCode === 'email_exists') {
    return new Error('Ya existe una cuenta con ese correo. Intenta iniciar sesión o recuperar tu contraseña.');
  }
  if (errorCode === 'weak_password' || /password.*(weak|short|characters)/i.test(message)) {
    return new Error('La contraseña no cumple los requisitos. Usa una contraseña más segura e inténtalo nuevamente.');
  }
  if (/over_email_send_rate_limit|email rate limit exceeded/i.test(`${errorCode} ${message}`)) {
    return new Error('Se enviaron demasiados correos en poco tiempo. Espera un momento antes de volver a intentarlo.');
  }
  if (errorCode === 'same_password' || /new password should be different/i.test(message)) {
    return new Error('La nueva contraseña debe ser diferente a la actual.');
  }

  if (constraintMessage) return new Error(constraintMessage);

  if (error?.code === '23505') {
    if (/reviews_|review/i.test(`${constraint || ''} ${message}`)) {
      return new Error('Ya existe una valoración de este tipo para esta experiencia. Puedes editarla en lugar de publicar otra.');
    }
    if (/email/i.test(message)) return new Error('Ya existe una cuenta con ese correo.');
    return new Error('Este registro ya existe. Actualiza la página e inténtalo de nuevo.');
  }

  if (error?.code === '23502') {
    const fieldMessage = FIELD_MESSAGES.find(([pattern]) => pattern.test(message))?.[1];
    return new Error(fieldMessage || 'Completa los campos obligatorios e inténtalo de nuevo.');
  }

  if (error?.code === '23514' || error?.code === '22001') {
    const fieldMessage = FIELD_MESSAGES.find(([pattern]) => pattern.test(message))?.[1];
    return new Error(fieldMessage || 'Uno de los datos ingresados no cumple el formato o la longitud permitidos. Revísalo e inténtalo de nuevo.');
  }

  if (error?.code === '22P02') {
    return new Error('Revisa los campos numéricos e ingresa valores válidos.');
  }

  if (error?.code === '42501' || /row-level security|permission denied/i.test(message)) {
    return new Error('No tienes permiso para realizar esta acción. Verifica que hayas iniciado sesión con la cuenta correcta.');
  }

  if (error?.code === 'PGRST116') {
    return new Error('No se encontró la información solicitada o ya no está disponible.');
  }

  if (error?.code === 'P0001' && APPLICATION_MESSAGES.has(message)) {
    return new Error(message);
  }

  if (/payload too large|file size.*exceed|maximum allowed size/i.test(message)) {
    return new Error('La imagen supera el tamaño máximo permitido de 10 MB.');
  }

  if (/mime type|content type|unsupported.*file/i.test(message)) {
    return new Error('El formato de la imagen no es compatible. Usa JPG, PNG o WebP.');
  }

  return new Error(fallback);
}
