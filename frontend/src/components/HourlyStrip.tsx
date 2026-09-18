import type React from 'react';
import { CloudIcon, SunIcon } from './icons';
import type { ForecastPeriod } from '../types';

interface HourlyStripProps {
  periods?: ForecastPeriod[];
}

function shortenLabel(label: string): string {
  if (!label) return '';
  const start = label.split(' to ')[0];
  return start.replace(/\s\d{4}\b/, '');
}

const cardStyle: React.CSSProperties = {
  borderRadius: 'var(--ct-card-radius)',
  backdropFilter: 'var(--ct-card-blur)',
  WebkitBackdropFilter: 'var(--ct-card-blur)',
  boxShadow: 'var(--ct-card-shadow)',
  borderStyle: 'var(--ct-card-border-style)',
};

export function HourlyStrip({ periods = [] }: HourlyStripProps) {
  if (periods.length === 0) {
    return (
      <section
        className="border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))]"
        style={cardStyle}
      >
        <p className="border-b border-[rgb(var(--ct-divider)/var(--ct-divider-o))] px-4 py-2 text-[12px] text-[rgb(var(--ct-text-primary)/0.85)]">
          Forecast unavailable from this data source.
        </p>
        <div className="flex min-h-[5rem] items-center justify-center text-sm text-[rgb(var(--ct-text-faint)/var(--ct-text-faint-o))]">
          --
        </div>
      </section>
    );
  }

  const slots = periods.map((period, index) => ({
    key: `${period.label}-${index}`,
    label: index === 0 ? 'Now' : shortenLabel(period.label),
    forecast: period.forecast,
  }));

  return (
    <section
      className="border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))]"
      style={cardStyle}
    >
      <p className="border-b border-[rgb(var(--ct-divider)/var(--ct-divider-o))] px-4 py-2 text-[12px] text-[rgb(var(--ct-text-primary)/0.85)]">
        24-hour regional forecast.
      </p>
      <div
        className="grid divide-x divide-[rgb(var(--ct-divider)/var(--ct-divider-o))]"
        style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
      >
        {slots.map((slot) => {
          const isFair = slot.forecast?.toLowerCase().includes('fair');
          return (
            <div key={slot.key} className="flex flex-col items-center gap-2 px-2 py-4 text-center">
              <div className="text-xs font-medium text-[rgb(var(--ct-text-primary)/0.85)]">
                {slot.label}
              </div>
              {isFair ? (
                <SunIcon className="h-7 w-7 text-amber-400" />
              ) : (
                <CloudIcon className="h-7 w-7 text-[rgb(var(--ct-text-primary)/0.85)]" />
              )}
              <div className="text-xs leading-snug text-[rgb(var(--ct-text-secondary)/var(--ct-text-secondary-o))]">
                {slot.forecast}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
