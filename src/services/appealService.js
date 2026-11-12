import { supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';

const APPEAL_FIELDS = 'id, appellant_id, reason, description, status, decision_note, reviewed_at, reviewed_by, created_at, appellant:appellant_id(full_name, email, role), reviewer:reviewed_by(full_name)';

export async function loadMyAccountAppeals(userId) {
  const { data, error } = await supabase
    .from('account_appeals')
    .select('id, reason, description, status, decision_note, reviewed_at, created_at')
    .eq('appellant_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw toUserFacingError(error, 'No se pudieron cargar tus solicitudes de revisión. Inténtalo nuevamente.');
  return data ?? [];
}

export async function submitAccountAppeal({ appellantId, reason, description }) {
  const { data, error } = await supabase
    .from('account_appeals')
    .insert({
      appellant_id: appellantId,
      reason: reason.trim(),
      description: description.trim(),
    })
    .select('id, reason, description, status, created_at')
    .single();

  if (error) throw toUserFacingError(error, 'No se pudo enviar la solicitud. Revisa los datos e inténtalo nuevamente.');
  return data;
}

export async function loadAdminAccountAppeals() {
  const { data, error } = await supabase
    .from('account_appeals')
    .select(APPEAL_FIELDS)
    .order('created_at', { ascending: false });

  if (error) throw toUserFacingError(error, 'No se pudieron cargar las solicitudes de revisión. Inténtalo nuevamente.');
  return data ?? [];
}

export async function resolveAccountAppeal(appealId, decision, decisionNote) {
  const { data, error } = await supabase.rpc('resolve_account_appeal', {
    p_appeal_id: appealId,
    p_decision: decision,
    p_decision_note: decisionNote.trim(),
  });

  if (error) throw toUserFacingError(error, 'No se pudo guardar la decisión. Inténtalo nuevamente.');
  return data;
}
