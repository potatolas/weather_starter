import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '../types';
import { formatTemperature } from './format';

const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];
const SINGAPORE_BOUNDS = L.latLngBounds([1.1, 103.6], [1.5, 104.1]);

interface WeatherMapProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  expanded?: boolean;
}

function FitLocations({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    const points = locations
      .filter((location) => Number.isFinite(location.latitude) && Number.isFinite(location.longitude))
      .map((location) => [location.latitude, location.longitude] as [number, number]);

    if (points.length === 0) {
      map.fitBounds(SINGAPORE_BOUNDS, { padding: [24, 24] });
    } else if (points.length === 1) {
      map.setView(points[0], 11);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 12 });
    }
  }, [locations, map]);

  return null;
}

function ResizeMap({ expanded }: { expanded: boolean }) {
  const map = useMap();

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [expanded, map]);

  return null;
}

function markerIcon(selected: boolean) {
  return L.divIcon({
    className: '',
    html: `<span class="weather-map-pin${selected ? ' weather-map-pin-selected' : ''}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export function WeatherMap({ locations, selectedId, onSelect, expanded = false }: WeatherMapProps) {
  const center = useMemo<[number, number]>(() => {
    const selected = locations.find((location) => location.id === selectedId);
    return selected ? [selected.latitude, selected.longitude] : SINGAPORE_CENTER;
  }, [locations, selectedId]);

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={expanded}
      className="h-full min-h-56 w-full"
      zoomControl={expanded}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitLocations locations={locations} />
      <ResizeMap expanded={expanded} />
      {locations.map((location) => {
        const selected = location.id === selectedId;
        return (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={markerIcon(selected)}
            eventHandlers={{ click: () => onSelect(location.id) }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -10]}
              className={`weather-map-label${selected ? ' weather-map-label-selected' : ''}`}
            >
              {formatTemperature(location.weather.temperature_c)}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
