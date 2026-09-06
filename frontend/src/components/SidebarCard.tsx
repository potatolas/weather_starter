import { useStore } from '../state/store';
import { CloseIcon, CloudIcon, HomeIcon } from './icons';
import { formatTemperature, formatTime } from './format';
import type { KeyboardEvent } from 'react';
import type { Location } from '../types';

interface SidebarCardProps {
  location: Location;
  isHome: boolean;
}

export function SidebarCard({ location, isHome }: SidebarCardProps) {
  const { selectedId, select, delete: remove } = useStore();
  const isSelected = selectedId === location.id;
  const observed = formatTime(location.weather.observed_at);
  const area =
    location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  const condition = location.weather.condition || '-';
  const temperature = formatTemperature(location.weather.temperature_c);
  const high = formatTemperature(location.weather.forecast_high_c);
  const low = formatTemperature(location.weather.forecast_low_c);

  const onSelect = () => select(location.id);
  const onDelete = () => {
    if (window.confirm(`Remove ${area}?`)) void remove(location.id);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full cursor-pointer overflow-hidden border text-left transition ${
        isSelected
          ? 'border-[rgb(var(--ct-card-border)/var(--ct-selected-border-o))] bg-[rgb(var(--ct-selected-bg)/var(--ct-selected-bg-o))]'
          : 'border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] hover:bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-alt-o))]'
      }`}
      style={{
        borderRadius: 'var(--ct-card-radius)',
        backdropFilter: 'var(--ct-card-blur)',
        WebkitBackdropFilter: 'var(--ct-card-blur)',
        boxShadow: isSelected
          ? 'var(--ct-card-shadow, 0 4px 8px rgba(0,0,0,0.2))'
          : 'var(--ct-card-shadow)',
        borderStyle: 'var(--ct-card-border-style)',
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        aria-label={`Remove ${area}`}
        className="absolute right-2 top-2 rounded-full p-1 text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))] hover:bg-[rgb(var(--ct-card-bg)/0.15)] hover:text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start justify-between gap-3 px-4 pt-3 pr-12">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold leading-tight text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]">{area}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            {isHome ? (
              <>
                <span>My Location</span>
                <span className="text-[rgb(var(--ct-text-muted)/0.40)]">·</span>
                <HomeIcon className="h-3 w-3" />
                <span>Home</span>
              </>
            ) : observed ? (
              <span>{observed}</span>
            ) : (
              <span className="text-[rgb(var(--ct-text-muted)/var(--ct-text-faint-o))]">Not refreshed</span>
            )}
          </div>
        </div>
        <div className="text-3xl font-light tabular-nums text-[rgb(var(--ct-text-secondary)/var(--ct-text-secondary-o))]">{temperature}</div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--ct-divider)/var(--ct-divider-o))] px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-[rgb(var(--ct-text-secondary)/0.80)]">
          <CloudIcon className="h-4 w-4 text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]" />
          <span>{condition}</span>
        </div>
        <div className="tabular-nums text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
          H:{high} L:{low}
        </div>
      </div>
    </div>
  );
}
