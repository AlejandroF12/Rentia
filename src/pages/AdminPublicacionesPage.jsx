import { useEffect, useMemo, useState } from 'react';
import { Ban, Check, Trash2, Tractor } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Estadistica from '../components/Estadistica';
import { CabeceraAdmin, PestanasAdmin } from '../components/AdminComunes';
import { loadAdminOverview, updateAdminEquipmentStatus } from '../services/adminService';

const labels = { publicada: 'Visible', revision: 'En revisión', suspendida: 'Suspendida', eliminada: 'Eliminada', borrador: 'Borrador', oculta: 'Oculta' };
const tones = { publicada: 'success', revision: 'warning', suspendida: 'danger', eliminada: 'neutral', borrador: 'neutral', oculta: 'warning' };

export default function AdminPublicacionesPage() {
  const [data, setData] = useState({ equipment: [] });
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const reload = () => loadAdminOverview().then(setData).catch((loadError) => setError(loadError.message));
  useEffect(() => { reload(); }, []);
  const equipment = useMemo(() => data.equipment.filter((item) => `${item.name} ${item.owner?.full_name || ''} ${item.municipality}`.toLowerCase().includes(search.trim().toLowerCase())), [data.equipment, search]);
  const counts = {
    publicada: data.equipment.filter((item) => item.publication_status === 'publicada').length,
    revision: data.equipment.filter((item) => item.publication_status === 'revision').length,
    suspendida: data.equipment.filter((item) => item.publication_status === 'suspendida').length,
  };
  const selected = data.equipment.find((item) => item.id === selectedId);
  const changeStatus = async (nextStatus) => {
    if (nextStatus === 'eliminada' && !window.confirm(`¿Eliminar la publicación "${selected.name}"?`)) return;
    setSaving(true); setError('');
    try { await updateAdminEquipmentStatus(selected.id, nextStatus); await reload(); }
    catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  };
  return (
    <DashboardLayout rol="admin" activo="publicaciones">
      <CabeceraAdmin seccion="Publicaciones" titulo="Publicaciones claras y confiables." subtitulo="Revisa equipos y retira contenido que incumpla las normas." />
      <div className="mt-6 grid grid-cols-3 gap-3 md:mt-8 md:gap-5">
        <Estadistica valor={counts.publicada} etiqueta="Visibles" icono={Tractor} /><Estadistica valor={counts.revision} etiqueta="En revisión" icono={Tractor} /><Estadistica valor={counts.suspendida} etiqueta="Suspendidas" icono={Tractor} />
      </div>
      <PestanasAdmin activa="publicaciones" reportCount={(data.reports || []).filter((report) => report.status !== 'resuelto').length} />
      <input aria-label="Buscar publicación" placeholder="Buscar equipo, propietario o municipio" value={search} onChange={(event) => setSearch(event.target.value)} className="mt-6 h-11 w-full rounded-lg border border-border bg-surface px-4 text-label" />
      {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
      <section aria-label="Publicaciones" className="mt-5 grid gap-3">
        {equipment.map((item) => <button type="button" key={item.id} onClick={() => setSelectedId(item.id)} className={`text-left ${selectedId === item.id ? 'ring-2 ring-primary' : ''}`}><Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-text">{item.name}</p><p className="text-small text-text-muted">{item.owner?.full_name || 'Propietario'} · {item.category} · {item.municipality}</p></div><Badge tone={tones[item.publication_status]}>{labels[item.publication_status] || item.publication_status}</Badge></Card></button>)}
        {!equipment.length && <Card><p className="text-body text-text-muted">No hay publicaciones que coincidan.</p></Card>}
      </section>
      {selected && <Card className="mt-6"><p className="text-caption uppercase text-text-muted">Publicación seleccionada</p><h2 className="mt-2 text-heading-md font-semibold text-text">{selected.name}</h2><p className="mt-2 text-small text-text-muted">{selected.owner?.full_name} · {selected.municipality}</p><div className="mt-5 flex flex-wrap gap-3">{selected.publication_status !== 'publicada' && selected.publication_status !== 'eliminada' && <Button type="button" icon={Check} disabled={saving} onClick={() => changeStatus('publicada')}>Publicar</Button>}{selected.publication_status === 'publicada' && <Button type="button" variant="secondary" icon={Ban} disabled={saving} onClick={() => changeStatus('suspendida')}>Suspender</Button>}{selected.publication_status !== 'eliminada' && <Button type="button" variant="danger" icon={Trash2} disabled={saving} onClick={() => changeStatus('eliminada')}>Eliminar</Button>}</div></Card>}
    </DashboardLayout>
  );
}
