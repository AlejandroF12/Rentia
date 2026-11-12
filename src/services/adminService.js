import { supabase } from '../lib/supabaseClient';
import { toUserFacingError } from '../utils/userFacingError';

const adminQuery = (table) => supabase.from(table);

async function countRows(query, label) {
  const { count, error } = await query;
  if (error) throw toUserFacingError(error, `No se pudo cargar ${label}. Inténtalo nuevamente.`);
  return count ?? 0;
}

export async function loadAdminDashboard() {
  const since30Days = new Date();
  since30Days.setDate(since30Days.getDate() - 30);
  const since = since30Days.toISOString();
  const since7Days = new Date();
  since7Days.setUTCHours(0, 0, 0, 0);
  since7Days.setUTCDate(since7Days.getUTCDate() - 6);
  const since7 = since7Days.toISOString();

  const [
    usersTotal, clients, landlords, usersActive, usersSuspended,
    equipmentTotal, equipmentPublished, equipmentDraft, equipmentReview, equipmentSuspended, equipmentHidden, equipmentDeleted,
    reportsPending, reportsReview, reportsResolved, newUsers30d, newListings30d,
    recentReports, usersByDay, listingsByDay,
  ] = await Promise.all([
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }), 'total de usuarios'),
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }).eq('role', 'cliente').eq('status', 'activo'), 'clientes'),
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }).eq('role', 'arrendador').eq('status', 'activo'), 'arrendadores'),
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }).eq('status', 'activo'), 'usuarios activos'),
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }).eq('status', 'suspendido'), 'usuarios suspendidos'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }), 'total de publicaciones'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'publicada'), 'publicaciones visibles'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'borrador'), 'borradores'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'revision'), 'publicaciones en revisión'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'suspendida'), 'publicaciones suspendidas'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'oculta'), 'publicaciones ocultas'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).eq('publication_status', 'eliminada'), 'publicaciones eliminadas'),
    countRows(adminQuery('reports').select('id', { count: 'exact', head: true }).eq('status', 'pendiente'), 'reportes pendientes'),
    countRows(adminQuery('reports').select('id', { count: 'exact', head: true }).eq('status', 'revision'), 'reportes en revisión'),
    countRows(adminQuery('reports').select('id', { count: 'exact', head: true }).eq('status', 'resuelto'), 'reportes resueltos'),
    countRows(adminQuery('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since), 'nuevos usuarios'),
    countRows(adminQuery('equipment').select('id', { count: 'exact', head: true }).gte('created_at', since), 'nuevas publicaciones'),
    adminQuery('reports')
      .select('id, reason, description, status, created_at, reporter:reporter_id(full_name), equipment:equipment_id(id, name), review:review_id(id, rating, comment)')
      .neq('status', 'resuelto')
      .order('created_at', { ascending: false })
      .limit(5),
    adminQuery('profiles').select('created_at').gte('created_at', since7),
    adminQuery('equipment').select('created_at').gte('created_at', since7),
  ]);

  for (const [result, label] of [[recentReports, 'los reportes recientes'], [usersByDay, 'la actividad de usuarios'], [listingsByDay, 'la actividad de publicaciones']]) {
    if (result.error) throw toUserFacingError(result.error, `No se pudo cargar ${label}. Inténtalo nuevamente.`);
  }
  const activityByDate = new Map();
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(since7Days);
    date.setUTCDate(date.getUTCDate() + offset);
    const key = date.toISOString().slice(0, 10);
    activityByDate.set(key, {
      date: key,
      label: date.toLocaleDateString('es-CO', { weekday: 'short', timeZone: 'UTC' }).replace('.', ''),
      users: 0,
      listings: 0,
    });
  }
  for (const user of usersByDay.data ?? []) {
    const day = activityByDate.get(user.created_at.slice(0, 10));
    if (day) day.users += 1;
  }
  for (const item of listingsByDay.data ?? []) {
    const day = activityByDate.get(item.created_at.slice(0, 10));
    if (day) day.listings += 1;
  }
  return {
    users: { total: usersTotal, clients, landlords, active: usersActive, suspended: usersSuspended, new30d: newUsers30d },
    equipment: { total: equipmentTotal, published: equipmentPublished, drafts: equipmentDraft, review: equipmentReview, suspended: equipmentSuspended, hidden: equipmentHidden, deleted: equipmentDeleted, new30d: newListings30d },
    reports: { pending: reportsPending, inReview: reportsReview, resolved: reportsResolved, recent: recentReports.data ?? [] },
    activity: [...activityByDate.values()],
  };
}

export async function loadAdminOverview() {
  const [users, equipment, reports] = await Promise.all([
    adminQuery('profiles').select('id, full_name, email, phone, municipality, role, status, created_at, suspension_reason, suspended_at').order('created_at', { ascending: false }),
    adminQuery('equipment').select('id, name, category, municipality, is_available, publication_status, owner:owner_id(id, full_name, email, status), updated_at, created_at').order('updated_at', { ascending: false }),
    adminQuery('reports').select('id, reason, description, status, created_at, reviewed_at, reviewed_by, resolution_note, reviewer:reviewed_by(full_name), reporter:reporter_id(full_name, role, status), equipment:equipment_id(id, name, municipality, owner_id, owner:owner_id(status)), review:review_id(id, rating, comment, is_published, target_user_id, author:author_id(status), target:target_user_id(status))').order('created_at', { ascending: false }),
  ]);

  for (const result of [users, equipment, reports]) {
    if (result.error) throw toUserFacingError(result.error, 'No se pudo cargar el panel. Inténtalo nuevamente.');
  }

  return {
    users: users.data ?? [],
    equipment: equipment.data ?? [],
    reports: reports.data ?? [],
  };
}

export async function updateAdminUserStatus(userId, status, { reason, reviewerId } = {}) {
  const updates = { status };
  if (status === 'suspendido') {
    const suspensionReason = reason?.trim() || '';
    if (suspensionReason.length < 10 || suspensionReason.length > 2000) {
      throw new Error('El motivo de suspensión debe tener entre 10 y 2000 caracteres.');
    }
    updates.suspension_reason = suspensionReason;
    updates.suspended_at = new Date().toISOString();
    updates.suspended_by = reviewerId;
  }
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select('id, status').single();
  if (error) throw toUserFacingError(error, 'No se pudo actualizar el usuario. Revisa la información e inténtalo nuevamente.');
  return data;
}

export async function updateAdminEquipmentStatus(equipmentId, publicationStatus) {
  const { data, error } = await supabase
    .from('equipment')
    .update({ publication_status: publicationStatus })
    .eq('id', equipmentId)
    .neq('publication_status', 'eliminada')
    .select('id, publication_status')
    .maybeSingle();
  if (error) throw toUserFacingError(error, 'No se pudo actualizar la publicación. Inténtalo nuevamente.');
  if (!data) throw new Error('No se encontró la publicación o ya fue eliminada.');
  return data;
}

export async function updateAdminReport(reportId, status, resolutionNote, reviewerId) {
  const { data, error } = await supabase
    .from('reports')
    .update({
      status,
      resolution_note: resolutionNote?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq('id', reportId)
    .select('id, status')
    .single();
  if (error) throw toUserFacingError(error, 'No se pudo actualizar el reporte. Inténtalo nuevamente.');
  return data;
}

export async function setAdminReviewVisibility(reviewId, isPublished) {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_published: isPublished })
    .eq('id', reviewId)
    .select('id, is_published')
    .single();
  if (error) throw toUserFacingError(error, 'No se pudo actualizar la visibilidad de la valoración. Inténtalo nuevamente.');
  return data;
}
