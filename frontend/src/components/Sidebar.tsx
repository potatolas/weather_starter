import { useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { SearchIcon } from './icons';
import { SidebarCard } from './SidebarCard';
import { AddLocationForm } from './AddLocationForm';

export function Sidebar() {
  const { locations, isLoading } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((location) => {
      const area = location.weather.area?.toLowerCase() ?? '';
      const condition = location.weather.condition?.toLowerCase() ?? '';
      return area.includes(q) || condition.includes(q);
    });
  }, [locations, query]);

  return (
    <aside className="flex w-[22rem] shrink-0 flex-col gap-3 border-r border-[rgb(var(--ct-sidebar-border)/var(--ct-sidebar-border-o))] bg-[rgb(var(--ct-sidebar-bg)/var(--ct-sidebar-bg-o))] p-4 backdrop-blur-2xl">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--ct-text-muted)/var(--ct-text-faint-o))]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full rounded-lg border border-[rgb(var(--ct-input-border)/var(--ct-input-border-o))] bg-[rgb(var(--ct-input-bg)/var(--ct-input-bg-o))] py-2 pl-9 pr-3 text-sm text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))] placeholder:text-[rgb(var(--ct-text-muted)/var(--ct-text-faint-o))]"
        />
      </div>

      <AddLocationForm />

      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {isLoading && locations.length === 0 ? (
          <p className="rounded-2xl border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] p-4 text-sm text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            Loading locations…
          </p>
        ) : filtered.length === 0 && locations.length > 0 ? (
          <p className="rounded-2xl border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] p-4 text-center text-sm text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            No matches
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/0.04)] p-6 text-center text-sm text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            No locations yet. Add one above.
          </p>
        ) : (
          filtered.map((location) => (
            <SidebarCard
              key={location.id}
              location={location}
              isHome={location.id === locations[0].id}
            />
          ))
        )}
      </div>
    </aside>
  );
}
