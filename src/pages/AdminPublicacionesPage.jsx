import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Ban, Check, Trash2, Tractor } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Estadistica from '../components/Estadistica';
import Avatar from '../components/Avatar';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { CabeceraAdmin, PestanasAdmin } from '../components/AdminComunes';
import { tiposEquipo } from '../data/muestra';
import { loadAdminOverview, updateAdminEquipmentStatus } from '../services/adminService';

const labels = { publicada: 'Visible', revision: 'En revisión', suspendida: 'Suspendida', eliminada: 'Eliminada', borrador: 'Borrador', oculta: 'Oculta' };
const tones = { publicada: 'success', revision: 'warning', suspendida: 'danger', eliminada: 'neutral', borrador: 'neutral', oculta: 'warning' };
const hiddenByAccount = { suspendido: 'Oculta: cuenta suspendida', eliminado: 'Oculta: cuenta eliminada' };

export default function AdminPublicacionesPage() {
  const [data, setData] = useState({ equipment: [] });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const reload = () => loadAdminOverview({ includeProfilePhotos: true, includeEquipmentImages: true })
    .then(setData)
    .catch((loadError) => setError(loadError.message))
    .finally(() => setLoading(false));
  useEffect(() => { reload(); }, []);
  const categories = useMemo(() => (
    [...new Set([
      ...tiposEquipo.filter((category) => category !== 'Todos los tipos'),
      ...data.equipment.map((item) => item.category).filter(Boolean),
    ])]
      .sort((first, second) => first.localeCompare(second, 'es'))
  ), [data.equipment]);
  const equipment = useMemo(() => data.equipment.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${item.name} ${item.owner?.full_name || ''} ${item.category || ''} ${item.municipality || ''}`.toLowerCase().includes(term);
    return matchesSearch
      && (statusFilter === 'todos' || item.publication_status === statusFilter)
      && (categoryFilter === 'todos' || item.category === categoryFilter);
  }), [data.equipment, search, statusFilter, categoryFilter]);
  const counts = {
    publicada: data.equipment.filter((item) => item.publication_status === 'publicada' && item.owner?.status === 'activo').length,
    revision: data.equipment.filter((item) => item.publication_status === 'revision').length,
    suspendida: data.equipment.filter((item) => item.publication_status === 'suspendida').length,
    eliminada: data.equipment.filter((item) => item.publication_status === 'eliminada').length,
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
      <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        <Estadistica valor={counts.publicada} etiqueta="Visibles" icono={Tractor} />
        <Estadistica valor={counts.revision} etiqueta="En revisión" icono={Tractor} />
        <Estadistica valor={counts.suspendida} etiqueta="Suspendidas" icono={Tractor} />
        <Estadistica valor={counts.eliminada} etiqueta="Eliminadas" icono={Tractor} />
      </div>
      <PestanasAdmin activa="publicaciones" reportCount={(data.reports || []).filter((report) => report.status !== 'resuelto').length} />
      <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_240px]">
        <input aria-label="Buscar publicación" placeholder="Buscar equipo, propietario, tipo o municipio" value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-label" />
        <select aria-label="Filtrar publicaciones por estado" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-lg border border-border bg-surface px-4 text-label">
          <option value="todos">Todos los estados</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Filtrar publicaciones por tipo de equipo" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-lg border border-border bg-surface px-4 text-label">
          <option value="todos">Todos los tipos</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
      {loading && <p role="status" aria-live="polite" className="mt-4 text-small text-text-muted">Cargando publicaciones…</p>}
      {!loading && !error && <p className="mt-4 text-small text-text-muted">{equipment.length} {equipment.length === 1 ? 'publicación' : 'publicaciones'}</p>}
      <section aria-label="Publicaciones" className="mt-5 grid gap-3">
        {equipment.map((item) => {
          const accountLabel = hiddenByAccount[item.owner?.status];
          return (
            <button type="button" key={item.id} onClick={() => setSelectedId(item.id)} className={`text-left ${selectedId === item.id ? 'ring-2 ring-primary' : ''}`}>
              <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl">
                    {item.image
                      ? <img src={item.image} alt={`Foto de ${item.name}`} className="size-full object-cover" />
                      : <ImagenNoEncontrada className="size-full" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text">{item.name}</p>
                    <div className="mt-1 flex min-w-0 items-center gap-2">
                      <Avatar src={item.owner?.avatar_url} alt={`Foto de ${item.owner?.full_name || 'propietario'}`} className="size-7" />
                      <p className="truncate text-small text-text-muted">{item.owner?.full_name || 'Propietario'} · {item.category} · {item.municipality}</p>
                    </div>
                  </div>
                </div>
                <Badge tone={accountLabel ? (item.owner.status === 'suspendido' ? 'danger' : 'neutral') : tones[item.publication_status]}>
                  {accountLabel || labels[item.publication_status] || item.publication_status}
                </Badge>
              </Card>
            </button>
          );
        })}
        {!loading && !error && !equipment.length && <Card><p className="text-body text-text-muted">No hay publicaciones que coincidan.</p></Card>}
      </section>
      {selected && (
        <Card className="mt-6">
          <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_1fr]">
            <div className="overflow-hidden rounded-xl">
              {selected.image
                ? <img src={selected.image} alt={`Foto de ${selected.name}`} className="aspect-[16/10] w-full object-cover" />
                : <ImagenNoEncontrada className="aspect-[16/10] w-full" />}
            </div>
            <div className="min-w-0">
              <p className="text-caption uppercase text-text-muted">Ficha de publicación</p>
              <h2 className="mt-1 text-heading-md font-semibold text-text">{selected.name}</h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar src={selected.owner?.avatar_url} alt={`Foto de ${selected.owner?.full_name || 'propietario'}`} className="size-11" />
                <div className="min-w-0">
                  <p className="font-semibold text-text">{selected.owner?.full_name || 'Propietario'}</p>
                  <p className="break-all text-small text-text-muted">{selected.owner?.email || 'Sin correo disponible'}</p>
                </div>
              </div>
              <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
                <div><dt className="font-semibold text-text-muted">Categoría</dt><dd className="mt-1 text-text">{selected.category}</dd></div>
                <div><dt className="font-semibold text-text-muted">Municipio</dt><dd className="mt-1 text-text">{selected.municipality}</dd></div>
                <div><dt className="font-semibold text-text-muted">Marca y modelo</dt><dd className="mt-1 text-text">{[selected.brand, selected.model, selected.model_year].filter(Boolean).join(' ') || 'No especificados'}</dd></div>
                <div><dt className="font-semibold text-text-muted">Disponibilidad</dt><dd className="mt-1 text-text">{selected.is_available ? 'Disponible' : 'No disponible'}</dd></div>
              </dl>
            </div>
          </div>
          {selected.main_feature && <p className="mt-5 text-small text-text"><span className="font-semibold">Característica:</span> {selected.main_feature}</p>}
          {selected.description && <p className="mt-3 whitespace-pre-wrap text-small text-text-muted">{selected.description}</p>}
          {hiddenByAccount[selected.owner?.status] && (
            <p className="mt-3 text-small text-text-muted">
              Se conserva, pero no es pública porque la cuenta del arrendador está {selected.owner.status}.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {selected.publication_status === 'publicada' && selected.owner?.status === 'activo' && (
              <Link to={`/detalle-equipo?id=${encodeURIComponent(selected.id)}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-label font-semibold text-text hover:bg-surface-muted">
                Abrir publicación <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
          {selected.owner?.status === 'activo' && (
            <div className="mt-5 flex flex-wrap gap-3">
              {selected.publication_status !== 'publicada' && selected.publication_status !== 'eliminada' && <Button type="button" icon={Check} disabled={saving} onClick={() => changeStatus('publicada')}>Publicar</Button>}
              {selected.publication_status === 'publicada' && <Button type="button" variant="secondary" icon={Ban} disabled={saving} onClick={() => changeStatus('suspendida')}>Suspender</Button>}
              {selected.publication_status !== 'eliminada' && <Button type="button" variant="danger" icon={Trash2} disabled={saving} onClick={() => changeStatus('eliminada')}>Eliminar</Button>}
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}
