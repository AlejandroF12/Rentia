import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Pagination from '../components/Pagination';
import EquipoCard from '../components/EquipoCard';
import { tiposEquipo } from '../data/muestra';
import { loadPublishedEquipment } from '../services/equipmentService';
import { loadFavoriteEquipmentIds } from '../services/clientService';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

const MUNICIPALITIES = {
  Yopal: { label: 'Yopal, Casanare', latitude: 5.33775, longitude: -72.39586 },
  Aguazul: { label: 'Aguazul, Casanare', latitude: 5.17282, longitude: -72.54706 },
  Tauramena: { label: 'Tauramena, Casanare', latitude: 5.0158, longitude: -72.75398 },
  Villanueva: { label: 'Villanueva, Casanare', latitude: 4.60917, longitude: -72.9275 },
};

const DEFAULT_FILTERS = {
  categories: [],
  municipality: 'Yopal',
  radius: 150,
  availableOnly: false,
};

function Filtros({ filters, onChange, onApply, onReset }) {
  return (
    <form onSubmit={onApply} onReset={onReset} className="hidden h-fit rounded-2xl border border-border bg-surface p-5 lg:block">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-semibold text-text">Filtros</h2>
        <button type="reset" className="text-small text-accent">Limpiar</button>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-3 text-label font-semibold text-text">Tipo de equipo</legend>
        <div className="space-y-3">
          {tiposEquipo.slice(1).map((tipo, i) => (
            <Checkbox
              key={tipo}
              id={`tipo-${i}`}
              checked={filters.categories.includes(tipo)}
              onChange={(event) => onChange({
                categories: event.target.checked
                  ? [...filters.categories, tipo]
                  : filters.categories.filter((category) => category !== tipo),
              })}
            >{tipo}</Checkbox>
          ))}
        </div>
      </fieldset>

      <hr className="my-5 border-border" />

      <div>
        <label htmlFor="cerca-de" className="mb-3 block text-label font-semibold text-text">Cerca de</label>
        <div className="relative">
          <select
            id="cerca-de"
            value={filters.municipality}
            onChange={(event) => onChange({ municipality: event.target.value })}
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-body text-text"
          >
            {Object.entries(MUNICIPALITIES).map(([value, location]) => <option key={value} value={value}>{location.label}</option>)}
          </select>
          <MapPin size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
        </div>
        <div className="mt-4 flex items-center justify-between text-small">
          <label htmlFor="radio" className="text-text-muted">Radio de búsqueda</label>
          <span className="font-semibold text-text">{filters.radius} km</span>
        </div>
        <input id="radio" type="range" min="10" max="300" value={filters.radius} onChange={(event) => onChange({ radius: Number(event.target.value) })} className="mt-2 w-full accent-primary" />
        <p className="mt-3 text-caption text-text-muted">Usamos ubicaciones aproximadas para mostrar equipos cercanos.</p>
      </div>

      <hr className="my-5 border-border" />

      <fieldset>
        <legend className="mb-3 text-label font-semibold text-text">Disponibilidad</legend>
        <Checkbox id="solo-disponibles" checked={filters.availableOnly} onChange={(event) => onChange({ availableOnly: event.target.checked })}>Solo disponibles</Checkbox>
        <p className="mt-2 text-caption text-text-muted">Estado indicado por el propietario.</p>
      </fieldset>

      <Button type="submit" size="lg" fullWidth className="mt-5">Aplicar filtros</Button>
    </form>
  );
}

export default function CatalogoPage() {
  const { session, profile } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('distance');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishedEquipment({ ...appliedFilters, search: appliedSearch }).then(setEquipment).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
    if (session?.user?.id && profile?.role === 'cliente') {
      loadFavoriteEquipmentIds(session.user.id).then(setFavoriteIds).catch((loadError) => setError(loadError.message));
    }
  }, [session?.user?.id, profile?.role, appliedFilters, appliedSearch]);

  const visibleEquipment = useMemo(() => {
    const location = userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : MUNICIPALITIES[appliedFilters.municipality];
    const distanceBetween = (item) => {
      if (!location || item.latitude == null || item.longitude == null) return null;
      const radians = (value) => value * Math.PI / 180;
      const latDelta = radians(Number(item.latitude) - location.latitude);
      const lonDelta = radians(Number(item.longitude) - location.longitude);
      const a = Math.sin(latDelta / 2) ** 2
        + Math.cos(radians(location.latitude)) * Math.cos(radians(Number(item.latitude))) * Math.sin(lonDelta / 2) ** 2;
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return equipment
    .map((item) => ({ ...item, distance: distanceBetween(item) }))
    .filter((item) => (
      (item.distance != null && item.distance <= appliedFilters.radius)
      || (item.distance == null && item.municipality.toLowerCase().startsWith(appliedFilters.municipality.toLowerCase()))
    ))
    .sort((first, second) => {
      if (sort === 'name') return first.name.localeCompare(second.name);
      if (sort === 'recent') return new Date(second.created_at) - new Date(first.created_at);
      return (first.distance ?? Number.MAX_SAFE_INTEGER) - (second.distance ?? Number.MAX_SAFE_INTEGER);
    })
    .map((item) => ({
      ...item,
      nombre: item.name,
      categoria: item.category,
      lugar: item.municipality,
      distancia: item.distance == null ? 'ubicación aproximada' : `${Math.round(item.distance)} km`,
      puntaje: '—',
      disponible: item.is_available,
    }));
  }, [equipment, appliedFilters, sort, userLocation]);

  const updateFilters = (changes) => setFilters((current) => ({ ...current, ...changes }));
  const applyFilters = (event) => {
    event.preventDefault();
    setLoading(true);
    setAppliedFilters(filters);
  };
  const resetFilters = () => {
    setLoading(true);
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };
  const applySearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setAppliedSearch(search);
  };
  const useUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Este navegador no permite obtener la ubicación.');
      return;
    }
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setFilters((current) => ({ ...current, radius: current.radius || 150 }));
        setAppliedFilters((current) => ({ ...current }));
      },
      () => setLocationError('No se pudo obtener tu ubicación. Puedes buscar por municipio.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-6 md:px-8 lg:px-16 lg:pt-8">
        <Breadcrumb>Inicio / Explorar equipos</Breadcrumb>

        <h1 className="mt-6 text-title-mobile font-semibold text-text md:text-title-desktop">
          <span className="lg:hidden">Tu próximo aliado.</span>
          <span className="hidden lg:inline">El equipo que necesitas, cerca.</span>
        </h1>
        <p className="mt-2 text-body-lg text-text-muted">Maquinaria y vehículos de propietarios de Casanare.</p>

        {/* Buscador */}
        <form role="search" className="mt-8 flex items-center gap-3 rounded-2xl bg-surface-muted p-3 md:pl-5" onSubmit={applySearch}>
          <Search size={18} aria-hidden="true" className="hidden shrink-0 text-text-muted sm:block" />
          <input
            type="search"
            aria-label="Buscar maquinaria o vehículo"
            name="busqueda"
            placeholder="Buscar maquinaria o vehículo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent px-2 text-body text-text placeholder:text-text-muted focus:outline-none"
          />
          <span className="hidden text-label text-text lg:block">{MUNICIPALITIES[filters.municipality].label}</span>
          <Button type="submit" size="lg">
            <span className="lg:hidden">Buscar</span>
            <span className="hidden lg:inline">Buscar equipos</span>
          </Button>
        </form>

        {/* Filtros en móvil */}
        <div className="mt-6 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-label font-semibold text-text">Afinar búsqueda</h2>
            <SlidersHorizontal size={18} aria-hidden="true" className="text-text-muted" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select aria-label="Tipo de equipo" value={filters.categories[0] || ''} onChange={(event) => updateFilters({ categories: event.target.value ? [event.target.value] : [] })} className="h-9 rounded-lg border border-border bg-surface px-3 text-small text-text">
              <option value="">Todos los tipos</option>
              {tiposEquipo.slice(1).map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small text-text">
              <span>Hasta</span>
              <input aria-label="Radio de búsqueda" type="number" min="10" max="300" value={filters.radius} onChange={(event) => updateFilters({ radius: Number(event.target.value) || 10 })} className="w-12 bg-transparent text-center" />
              <span>km</span>
            </label>
            <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small text-text">
              <input type="checkbox" checked={filters.availableOnly} onChange={(event) => updateFilters({ availableOnly: event.target.checked })} className="accent-primary" />
              Solo disponibles
            </label>
          </div>
          <Button type="button" size="sm" className="mt-3" onClick={applyFilters}>Aplicar filtros</Button>
          <p className="mt-3 text-small text-text-muted">Cerca de {MUNICIPALITIES[filters.municipality].label.split(',')[0]} · Distancia aproximada</p>
          <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={useUserLocation}>Usar mi ubicación GPS</Button>
          {locationError && <p role="alert" className="mt-2 text-small text-danger">{locationError}</p>}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <Filtros filters={filters} onChange={updateFilters} onApply={applyFilters} onReset={resetFilters} />

          <section aria-labelledby="resultados">
            <div className="flex items-center justify-between">
              <h2 id="resultados" className="text-label text-text md:text-body">{loading ? 'Cargando equipos...' : `${visibleEquipment.length} equipos publicados`}</h2>
              <label className="inline-flex items-center gap-2 text-small text-text-muted">
                Ordenar
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent font-semibold text-text">
                  <option value="distance">Más cercanos</option>
                  <option value="recent">Más recientes</option>
                  <option value="name">Nombre</option>
                </select>
              </label>
            </div>

            <div className="mt-3 hidden gap-2 lg:flex">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• Hasta {appliedFilters.radius} km</span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• {appliedFilters.availableOnly ? 'Solo disponibles' : 'Todos los estados'}</span>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {loading && Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[16/10] w-full md:aspect-[16/9]" />)}
              {error && <p role="alert" className="text-small text-danger">{error}</p>}
              {!loading && !error && visibleEquipment.length === 0 && <p className="text-body text-text-muted">No hay equipos publicados que coincidan con tu búsqueda.</p>}
              {!loading && visibleEquipment.map((equipo) => (
                <EquipoCard
                  key={equipo.id}
                  equipo={equipo}
                  favorito={profile?.role === 'cliente'}
                  isFavorite={favoriteIds.includes(equipo.id)}
                  onFavoriteChange={(id, value) => setFavoriteIds((current) => value ? [...new Set([...current, id])] : current.filter((item) => item !== id))}
                />
              ))}
            </div>

            <div className="mt-10">
              <Pagination />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
