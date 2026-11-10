import { supabase } from '../lib/supabaseClient';

const APPEAL_FIELDS = 'id, appellant_id, reason, description, status, decision_note, reviewed_at, reviewed_by, created_at, appellant:appellant_id(full_name, email, role), reviewer:reviewed_by(full_name)';

export async function loadMyAccountAppeals(userId) {
  const { data, error } = await supabase
    .from('account_appeals')
    .select('id, reason, description, status, decision_note, reviewed_at, created_at')
    .eq('appellant_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`No se pudieron cargar tus solicitudes de revisión: ${error.message}`);
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

  if (error) throw new Error(`No se pudo enviar la solicitud de revisión: ${error.message}`);
  return data;
}

export async function loadAdminAccountAppeals() {
  const { data, error } = await supabase
    .from('account_appeals')
    .select(APPEAL_FIELDS)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`No se pudieron cargar las solicitudes de revisión: ${error.message}`);
  return data ?? [];
}

export async function resolveAccountAppeal(appealId, decision, decisionNote) {
  const { data, error } = await supabase.rpc('resolve_account_appeal', {
    p_appeal_id: appealId,
    p_decision: decision,
    p_decision_note: decisionNote.trim(),
  });

  if (error) throw new Error(`No se pudo resolver la solicitud de revisión: ${error.message}`);
  return data;
}
