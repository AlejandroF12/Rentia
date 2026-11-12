import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { geocodeColombianMunicipality } from '../utils/location';
import { getDeviceLocation, getDeviceLocationError } from '../utils/deviceLocation';

const MUNICIPALITIES = {
  Yopal: { label: 'Yopal, Casanare', latitude: 5.33775, longitude: -72.39586 },
  Aguazul: { label: 'Aguazul, Casanare', latitude: 5.17282, longitude: -72.54706 },
  Tauramena: { label: 'Tauramena, Casanare', latitude: 5.0158, longitude: -72.75398 },
  Villanueva: { label: 'Villanueva, Casanare', latitude: 4.60917, longitude: -72.9275 },
};

const DEFAULT_FILTERS = {
  categories: [],
  municipality: 'Yopal',
  municipalityCoordinates: MUNICIPALITIES.Yopal,
  radius: 150,
  gpsActive: false,
  availableOnly: false,
};
const EQUIPMENT_PAGE_SIZE = 9;

function Filtros({ filters, onChange, onApply, onReset, filterError, onUseLocation, locationRequesting }) {
  const gpsActive = Boolean(filters.gpsActive);
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
          <input
            id="cerca-de"
            value={filters.municipality}
            onChange={(event) => onChange({ municipality: event.target.value, municipalityCoordinates: null })}
            placeholder="Ej. municipio o ciudad"
            className="h-11 w-full rounded-lg border border-border bg-surface px-3 pr-10 text-body text-text placeholder:text-text-muted"
          />
          <MapPin size={16} aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
        </div>
        {filterError && <p role="alert" className="mt-2 text-small text-danger">{filterError}</p>}
        <div className="mt-4 flex items-center justify-between text-small">
          <label htmlFor="radio" className="text-text-muted">Radio de búsqueda</label>
          <span className={`font-semibold ${gpsActive ? 'text-text' : 'text-text-muted'}`}>{gpsActive ? `${filters.radius} km` : 'Activa el GPS'}</span>
        </div>
        <input id="radio" type="range" min="10" max="300" value={filters.radius} disabled={!gpsActive} onChange={(event) => onChange({ radius: Number(event.target.value) })} className="mt-2 w-full accent-primary disabled:cursor-not-allowed disabled:opacity-40" />
        <p className="mt-3 text-caption text-text-muted">{gpsActive ? 'Mostramos equipos según tu ubicación GPS.' : 'Solicita acceso a tu ubicación para activar el radio.'}</p>
        <Button type="button" variant="secondary" size="sm" fullWidth className="mt-3" onClick={onUseLocation} disabled={locationRequesting}>
          {locationRequesting ? 'Solicitando acceso...' : gpsActive ? 'GPS activado' : 'Activar mi ubicación GPS'}
        </Button>
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
  const [searchParams] = useSearchParams();
  const { session, profile } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const initialSearch = searchParams.get('search') || '';
  const initialMunicipality = searchParams.get('municipality') || '';
  const initialAvailable = searchParams.get('available') === 'true';
  const requestedCategory = searchParams.get('category');
  const initialCategory = tiposEquipo.includes(requestedCategory) ? requestedCategory : '';
  const initialFilters = { ...DEFAULT_FILTERS, categories: initialCategory ? [initialCategory] : [], municipality: initialMunicipality, municipalityCoordinates: initialMunicipality ? null : DEFAULT_FILTERS.municipalityCoordinates, availableOnly: initialAvailable };
  const [search, setSearch] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [sort, setSort] = useState('distance');
  const [page, setPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequesting, setLocationRequesting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [filterError, setFilterError] = useState('');
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
      : null;
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
    .filter((item) => {
      if (location) return item.distance != null && item.distance <= appliedFilters.radius;
      if (appliedFilters.municipality.trim()) {
        return item.municipality?.toLowerCase().startsWith(appliedFilters.municipality.toLowerCase());
      }
      return true;
    })
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
      puntaje: item.rating == null ? '—' : item.rating.toFixed(1),
      imagen: item.image,
      disponible: item.is_available,
    }));
  }, [equipment, appliedFilters, sort, userLocation]);
  const totalPages = Math.ceil(visibleEquipment.length / EQUIPMENT_PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const paginatedEquipment = useMemo(() => (
    visibleEquipment.slice((currentPage - 1) * EQUIPMENT_PAGE_SIZE, currentPage * EQUIPMENT_PAGE_SIZE)
  ), [visibleEquipment, currentPage]);

  const updateFilters = (changes) => setFilters((current) => ({ ...current, ...changes }));
  const applyFilters = (event) => {
    event.preventDefault();
    setFilterError('');
    setLoading(true);
    setPage(1);
    const apply = async () => {
      let nextFilters = filters;
      if (!userLocation && filters.municipality.trim() && !filters.municipalityCoordinates) {
        try {
          const coordinates = await geocodeColombianMunicipality(filters.municipality);
          if (!coordinates) {
            setFilterError('No encontramos ese municipio en Colombia. Verifica el nombre e inténtalo de nuevo.');
            setLoading(false);
            return;
          }
          nextFilters = { ...filters, municipalityCoordinates: coordinates };
        } catch (geocodeError) {
          setFilterError(geocodeError.message);
          setLoading(false);
          return;
        }
      }
      setFilters({ ...nextFilters, gpsActive: Boolean(userLocation) });
      setAppliedFilters({ ...nextFilters, gpsActive: Boolean(userLocation) });
    };
    apply();
  };
  const resetFilters = () => {
    setLoading(true);
    setPage(1);
    setUserLocation(null);
    setFilters({ ...DEFAULT_FILTERS, gpsActive: false });
    setAppliedFilters({ ...DEFAULT_FILTERS, gpsActive: false });
    setFilterError('');
  };
  const applySearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setAppliedSearch(search);
  };
  const useUserLocation = async () => {
    setLocationError('');
    setLocationRequesting(true);
    try {
      const position = await getDeviceLocation();
      setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setPage(1);
      setFilters((current) => ({ ...current, gpsActive: true, radius: current.radius || 150 }));
      setAppliedFilters((current) => ({ ...current, gpsActive: true }));
    } catch (error) {
      setLocationError(getDeviceLocationError(error, 'No se pudo obtener tu ubicación. Activa el GPS e inténtalo de nuevo.'));
    } finally {
      setLocationRequesting(false);
    }
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
            className="h-11 min-w-0 flex-1 bg-transparent px-2 text-body text-text placeholder:text-text-muted focus:outline-none sm:h-10"
          />
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
            <select aria-label="Tipo de equipo" value={filters.categories[0] || ''} onChange={(event) => updateFilters({ categories: event.target.value ? [event.target.value] : [] })} className="h-11 rounded-lg border border-border bg-surface px-3 text-small text-text sm:h-9">
              <option value="">Todos los tipos</option>
              {tiposEquipo.slice(1).map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
            <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small text-text sm:h-9">
              <span>Hasta</span>
              <input aria-label="Radio de búsqueda" type="number" min="10" max="300" value={filters.radius} disabled={!filters.gpsActive} onChange={(event) => updateFilters({ radius: Number(event.target.value) || 10 })} className="w-12 bg-transparent text-center disabled:cursor-not-allowed disabled:opacity-40" />
              <span>km</span>
            </label>
            <input
              aria-label="Municipio"
              value={filters.municipality}
              onChange={(event) => updateFilters({ municipality: event.target.value, municipalityCoordinates: null })}
              placeholder="Municipio"
              className="h-11 min-w-32 rounded-lg border border-border bg-surface px-3 text-small text-text sm:h-9"
            />
            <label className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small text-text sm:h-9">
              <input type="checkbox" checked={filters.availableOnly} onChange={(event) => updateFilters({ availableOnly: event.target.checked })} className="accent-primary" />
              Solo disponibles
            </label>
          </div>
          <Button type="button" size="sm" className="mt-3" onClick={applyFilters}>Aplicar filtros</Button>
          <p className="mt-3 text-small text-text-muted">Cerca de {filters.municipality || 'tu ubicación'} · Distancia aproximada</p>
          {filterError && <p role="alert" className="mt-2 text-small text-danger">{filterError}</p>}
          <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={useUserLocation} disabled={locationRequesting}>
            {locationRequesting ? 'Solicitando acceso...' : filters.gpsActive ? 'GPS activado' : 'Activar mi ubicación GPS'}
          </Button>
          {locationError && <p role="alert" className="mt-2 text-small text-danger">{locationError}</p>}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
          <Filtros filters={filters} onChange={updateFilters} onApply={applyFilters} onReset={resetFilters} filterError={filterError} onUseLocation={useUserLocation} locationRequesting={locationRequesting} />

          <section aria-labelledby="resultados">
            <div className="flex items-center justify-between">
              <h2 id="resultados" className="text-label text-text md:text-body">{loading ? 'Cargando equipos...' : `${visibleEquipment.length} equipos publicados`}</h2>
              <label className="inline-flex items-center gap-2 text-small text-text-muted">
                Ordenar
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="min-h-11 bg-transparent font-semibold text-text sm:min-h-0">
                  <option value="distance">Más cercanos</option>
                  <option value="recent">Más recientes</option>
                  <option value="name">Nombre</option>
                </select>
              </label>
            </div>

            <div className="mt-3 hidden gap-2 lg:flex">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">
                • {appliedFilters.gpsActive ? `Hasta ${appliedFilters.radius} km` : 'GPS no activado'}
              </span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-small text-text-muted">• {appliedFilters.availableOnly ? 'Solo disponibles' : 'Todos los estados'}</span>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {loading && Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="aspect-[16/10] w-full md:aspect-[16/9]" />)}
              {error && <p role="alert" className="text-small text-danger">{error}</p>}
              {!loading && !error && visibleEquipment.length === 0 && <p className="text-body text-text-muted">No hay equipos publicados que coincidan con tu búsqueda.</p>}
              {!loading && paginatedEquipment.map((equipo) => (
                <EquipoCard
                  key={equipo.id}
                  equipo={equipo}
                  favorito={profile?.role === 'cliente'}
                  isFavorite={favoriteIds.includes(equipo.id)}
                  onFavoriteChange={(id, value) => setFavoriteIds((current) => value ? [...new Set([...current, id])] : current.filter((item) => item !== id))}
                />
              ))}
            </div>

            {!loading && !error && totalPages > 1 && (
              <div className="mt-10">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
