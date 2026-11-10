import { setRememberSession, supabase } from '../lib/supabaseClient';

const APP_URL = 'https://www.rentiaapp.me';

export async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, municipality, role, status, contact_authorized, created_at, suspension_reason, suspended_at')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`No se pudo cargar el perfil: ${error.message}`);
  }

  return data;
}

export async function signIn(email, password, remember) {
  setRememberSession(remember);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);
  return data;
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/nueva-contrasena`,
  });
  if (error) throw new Error(error.message);
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}
