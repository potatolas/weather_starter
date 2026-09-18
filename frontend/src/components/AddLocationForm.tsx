import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../state/store';
import { PlusIcon } from './icons';

export function AddLocationForm() {
  const { isAdding, setAdding, create } = useStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cancel = () => {
    setLatitude('');
    setLongitude('');
    setSubmitError(null);
    setAdding(false);
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
          disabled={submitting}
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
