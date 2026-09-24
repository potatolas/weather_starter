import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../state/store';
import { CrosshairIcon, PlusIcon } from './icons';
import { logInteraction } from '../api';

type GeoState = 'idle' | 'locating' | 'submitting';

export function AddLocationForm() {
  const { isAdding, setAdding, create, createOrSelect } = useStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<GeoState>('idle');

  const cancel = () => {
    setLatitude('');
    setLongitude('');
    setSubmitError(null);
    setGeoState('idle');
    setAdding(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setSubmitError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoState('locating');
    setSubmitError(null);
    logInteraction('location_use_my_location_clicked');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Pre-validate Singapore bounds before hitting the API.
        if (!(1.1 <= lat && lat <= 1.5 && 103.6 <= lon && lon <= 104.1)) {
          setGeoState('idle');
          setSubmitError("You don't appear to be in Singapore.");
          logInteraction('location_use_my_location_outside_singapore', { lat, lon });
          return;
        }
        setGeoState('submitting');
        try {
          await createOrSelect({ latitude: lat, longitude: lon });
          setGeoState('idle');
        } catch (err) {
          setGeoState('idle');
          setSubmitError(err instanceof Error ? err.message : 'Could not add location');
        }
      },
      (err) => {
        setGeoState('idle');
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setSubmitError('Location access was denied. Please allow it in your browser settings.');
        } else if (err.code === GeolocationPositionError.TIMEOUT) {
          setSubmitError('Location request timed out. Please try again.');
        } else {
          setSubmitError('Unable to determine your location. Please try again.');
        }
        logInteraction('location_use_my_location_geo_error', { code: err.code });
      },
      { timeout: 10_000, maximumAge: 60_000 },
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await create({ latitude: Number(latitude), longitude: Number(longitude) });
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-o))] px-3 py-2.5 text-sm font-medium text-[rgb(var(--ct-text-primary)/0.85)] backdrop-blur-xl hover:bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-alt-o))]"
      >
        <PlusIcon />
        <span>Add Location</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2.5 rounded-2xl border border-[rgb(var(--ct-card-border)/var(--ct-card-border-o))] bg-[rgb(var(--ct-card-bg)/0.10)] p-3 backdrop-blur-xl"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
        New coordinate
      </p>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={geoState !== 'idle' || submitting}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[rgb(var(--ct-input-border)/var(--ct-input-border-o))] bg-[rgb(var(--ct-input-bg)/var(--ct-input-bg-o))] px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--ct-text-primary)/0.85)] hover:bg-[rgb(var(--ct-card-bg)/var(--ct-card-bg-alt-o))] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Use my current location"
      >
        <CrosshairIcon className="h-3.5 w-3.5" />
        <span>
          {geoState === 'locating' && 'Locating…'}
          {geoState === 'submitting' && 'Adding…'}
          {geoState === 'idle' && 'Use my location'}
        </span>
      </button>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          <span className="text-[11px] text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            Latitude
          </span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="1.3508"
            required
            className="rounded-md border border-[rgb(var(--ct-input-border)/var(--ct-input-border-o))] bg-[rgb(var(--ct-input-bg)/var(--ct-input-bg-o))] px-2 py-1.5 text-sm text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))] placeholder:text-[rgb(var(--ct-text-muted)/0.40)]"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[11px] text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))]">
            Longitude
          </span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="103.8390"
            required
            className="rounded-md border border-[rgb(var(--ct-input-border)/var(--ct-input-border-o))] bg-[rgb(var(--ct-input-bg)/var(--ct-input-bg-o))] px-2 py-1.5 text-sm text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))] placeholder:text-[rgb(var(--ct-text-muted)/0.40)]"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[rgb(var(--ct-text-muted)/var(--ct-text-muted-o))] hover:text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || geoState !== 'idle'}
          className="rounded-md bg-[rgb(var(--ct-accent-bg)/var(--ct-accent-bg-o))] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--ct-accent-text)/var(--ct-accent-text-o))] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Adding…' : 'Add'}
        </button>
      </div>
      {submitError && (
        <p className="rounded-md border border-red-300/30 bg-red-500/15 px-2.5 py-1.5 text-xs text-red-100">
          {submitError}
        </p>
      )}
    </form>
  );
}
