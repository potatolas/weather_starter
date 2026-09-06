import { useEffect, useState } from 'react';
import { useStore } from '../state/store';
import { CloseIcon, ExpandIcon, MapIcon } from './icons';
import { WeatherMap } from './WeatherMap';

export function MapCard() {
  const { locations, selectedId, select } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg-alt)/var(--ct-card-bg-o))] shadow-xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--ct-text-secondary)/var(--ct-text-secondary-o))]">
            <MapIcon className="h-4 w-4 text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]" />
            <span>Locations</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--ct-text-secondary)/0.80)] hover:bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-alt-o))]"
          >
            <ExpandIcon className="h-3.5 w-3.5" />
            Expand
          </button>
        </div>
        <div className="h-64">
          <WeatherMap locations={locations} selectedId={selectedId} onSelect={select} />
        </div>
      </section>

      {isExpanded && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md sm:p-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="fullscreen-map-title"
            className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-[rgb(var(--ct-card-border)/0.20)] bg-slate-800/90 shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 id="fullscreen-map-title" className="flex items-center gap-2 font-medium text-white/95">
                <MapIcon className="h-4 w-4 text-white/70" />
                Weather map
              </h2>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close fullscreen map"
                className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white/95"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <WeatherMap
                locations={locations}
                selectedId={selectedId}
                onSelect={select}
                expanded
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
