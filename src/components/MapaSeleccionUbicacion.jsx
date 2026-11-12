import { LocateFixed, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getMunicipalityCoordinates } from '../utils/location';
import { municipios } from '../data/panel';
import { normalizeLocationText } from '../utils/location';
import { getDeviceLocation, getDeviceLocationError } from '../utils/deviceLocation';

function MapInteraction({ onSelect }) {
  useMapEvents({ click: (event) => onSelect([event.latlng.lat, event.latlng.lng]) });
  return null;
}

function RecenterMap({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates);
  }, [coordinates, map]);
  return null;
}

export default function MapaSeleccionUbicacion({ municipality, latitude, longitude, onChange = () => {}, onDetectionStatus = () => {}, interactive = true }) {
  const initialCoordinates = latitude != null && longitude != null
    ? [Number(latitude), Number(longitude)]
    : getMunicipalityCoordinates(municipality);
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [locationError, setLocationError] = useState('');
  const [locationRequesting, setLocationRequesting] = useState(false);

  const reverseGeocode = async (nextCoordinates) => {
    onDetectionStatus('loading');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextCoordinates[0]}&lon=${nextCoordinates[1]}&zoom=12&addressdetails=1`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('No se pudo consultar la dirección');
      const address = (await response.json()).address || {};
      const place = address.city || address.town || address.municipality || address.city_district || address.county || address.village;
      const normalizedPlace = normalizeLocationText(place);
      const normalizedAddressValues = Object.values(address).map((value) => normalizeLocationText(value));
      const matchedMunicipality = municipios.find((item) => {
        const name = normalizeLocationText(item.split(',')[0]);
        return name === normalizedPlace || normalizedAddressValues.includes(name);
      });
      const sector = address.suburb || address.neighbourhood || address.quarter || address.village;
      onChange({
        latitude: nextCoordinates[0],
        longitude: nextCoordinates[1],
        ...(matchedMunicipality ? { municipality: matchedMunicipality } : {}),
        ...(sector ? { sector } : {}),
      });
      onDetectionStatus(matchedMunicipality ? 'detected' : 'not-found');
    } catch {
      onChange({ latitude: nextCoordinates[0], longitude: nextCoordinates[1] });
      onDetectionStatus('not-found');
      setLocationError('Punto guardado. No se pudo identificar automáticamente el municipio o sector.');
    }
  };

  const selectCoordinates = (nextCoordinates) => {
    setCoordinates(nextCoordinates);
    setLocationError('');
    onChange({ latitude: nextCoordinates[0], longitude: nextCoordinates[1] });
    if (interactive) reverseGeocode(nextCoordinates);
  };

  const useCurrentLocation = async () => {
    setLocationError('');
    setLocationRequesting(true);
    try {
      const position = await getDeviceLocation();
      selectCoordinates([position.coords.latitude, position.coords.longitude]);
    } catch (error) {
      setLocationError(getDeviceLocationError(error, 'No se pudo obtener tu ubicación. Puedes fijar el punto manualmente.'));
    } finally {
      setLocationRequesting(false);
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <MapContainer center={coordinates} zoom={12} scrollWheelZoom className="h-56 w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {interactive && <MapInteraction onSelect={selectCoordinates} />}
          <RecenterMap coordinates={coordinates} />
          <CircleMarker center={coordinates} radius={10} pathOptions={{ color: '#0f766e', fillColor: '#0f766e', fillOpacity: 0.8 }}>
            <MapPin size={16} aria-hidden="true" />
          </CircleMarker>
        </MapContainer>
        {interactive && (
          <button type="button" onClick={useCurrentLocation} disabled={locationRequesting} className="absolute right-3 top-3 z-[1000] inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-small font-semibold text-text shadow disabled:cursor-wait disabled:opacity-70">
            <LocateFixed size={15} aria-hidden="true" />
            {locationRequesting ? 'Solicitando ubicación...' : 'Usar mi ubicación GPS'}
          </button>
        )}
      </div>
      {interactive && (
        <>
          <p className="mt-2 text-small text-text-muted">
            Haz clic en el mapa para ubicar el equipo. Coordenadas: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
          </p>
          {locationError && <p role="alert" className="mt-2 text-small text-danger">{locationError}</p>}
        </>
      )}
    </div>
  );
}
