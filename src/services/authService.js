import { setRememberSession, supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';

const APP_URL = 'https://www.rentiaapp.me';

export async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, municipality, role, status, contact_authorized, created_at, suspension_reason, suspended_at')
    .eq('id', userId)
    .single();

  if (error) {
    throw toUserFacingError(error, 'No se pudo cargar tu perfil. Inténtalo nuevamente.');
  }

  return data;
}

export async function signIn(email, password, remember) {
  setRememberSession(remember);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw toUserFacingError(error, 'No se pudo iniciar sesión. Revisa tu correo y contraseña e inténtalo nuevamente.');
  return data;
}

export async function signUp({ email, password, fullName, phone, role, contactAuthorized }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role, contact_authorized: role === 'arrendador' && contactAuthorized === true },
      emailRedirectTo: `${APP_URL}/`,
    },
  });
  if (error) throw toUserFacingError(error, 'No se pudo crear la cuenta. Revisa los datos ingresados e inténtalo nuevamente.');
  return data;
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/nueva-contrasena`,
  });
  if (error) throw toUserFacingError(error, 'No se pudo enviar el enlace de recuperación. Revisa el correo e inténtalo nuevamente.');
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw toUserFacingError(error, 'No se pudo cambiar la contraseña. Comprueba los requisitos e inténtalo nuevamente.');
}
