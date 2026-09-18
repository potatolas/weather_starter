import { useStore, useSelectedLocation } from '../state/store';
import { LocationIcon, RefreshIcon } from './icons';
import { HourlyStrip } from './HourlyStrip';
import { TenDayForecast } from './TenDayForecast';
import { TileGrid } from './Tiles';
import { MapCard } from './MapCard';
import { formatTemperature, formatTime } from './format';

export function Hero() {
  const { locations, refresh, refreshingId } = useStore();
  const selected = useSelectedLocation();

  if (!selected) {
    return (
      <main className="flex flex-1 flex-col p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-light text-[rgb(var(--ct-text-primary)/0.85)]">
              Select a location
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
              Add a Singapore coordinate from the sidebar to see its weather.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isHome = locations[0]?.id === selected.id;
  const area =
    selected.weather?.area || `${selected.latitude.toFixed(3)}, ${selected.longitude.toFixed(3)}`;
  const condition = selected.weather?.condition || 'Conditions unavailable';
  const observed = formatTime(selected.weather?.observed_at);
  const validPeriod = selected.weather?.valid_period_text;
  const source = selected.weather?.source;
  const isRefreshing = refreshingId === selected.id;
  const temperature = formatTemperature(selected.weather?.temperature_c);
  const high = formatTemperature(selected.weather?.forecast_high_c);
  const low = formatTemperature(selected.weather?.forecast_low_c);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-6 lg:p-8">
        <header className="flex flex-col items-center pt-6 pb-2 text-center">
          {isHome && (
            <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
              <LocationIcon className="h-3 w-3" />
              <span>Home</span>
            </div>
          )}
          <h1 className="text-4xl font-light leading-tight text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]">
            {area}
          </h1>
          <div className="mt-2 text-[6.5rem] font-extralight leading-none tracking-tight text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]">
            {temperature}
          </div>
          <div className="mt-1 text-lg text-[rgb(var(--ct-text-secondary)/var(--ct-text-secondary-o))]">
            {condition}
          </div>
          <div className="mt-1 text-sm tabular-nums text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            H:{high} L:{low}
          </div>
          {observed && (
            <div className="mt-3 text-xs text-[rgb(var(--ct-text-faint)/var(--ct-text-faint-o))]">
              Updated {observed}
            </div>
          )}
        </header>

        {validPeriod && (
          <p className="px-2 pb-1 text-center text-xs text-[rgb(var(--ct-text-muted)/0.65)]">
            {validPeriod}
          </p>
        )}

        <HourlyStrip periods={selected.weather?.forecast_periods} />
        <TenDayForecast weather={selected.weather} />
        <TileGrid weather={selected.weather} />
        <MapCard />

        <footer className="mt-2 flex flex-col items-center gap-3 pb-8 text-xs text-[rgb(var(--ct-text-faint)/var(--ct-text-faint-o))]">
          <button
            type="button"
            onClick={() => void refresh(selected.id)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--ct-text-primary)/0.85)] backdrop-blur-xl hover:bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-alt-o))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshIcon className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
          </button>
          <p>
            Weather for {area}
            {source ? ` · ${source}` : ''}
          </p>
        </footer>
      </div>
    </main>
  );
}
