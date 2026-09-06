import { useEffect, useRef, useState } from 'react';
import { THEMES, useTheme } from '../theme';
import type { ThemeId } from '../theme';

const THEME_SWATCHES: Record<ThemeId, string> = {
  apple: 'bg-gradient-to-br from-[#6f8aa8] to-[#3c5066]',
  obsidian: 'bg-gradient-to-br from-[#4f46e5] to-[#0a0a12]',
  solar: 'bg-gradient-to-br from-[#ff9a3c] to-[#c0392b]',
  forest: 'bg-gradient-to-br from-[#4a8c38] to-[#162614]',
  ocean: 'bg-gradient-to-br from-[#0d2137] to-[#00d4ff]',
  desert: 'bg-gradient-to-br from-[#c0705a] to-[#3d2040]',
  blossom: 'bg-gradient-to-br from-[#ffe4ec] to-[#ffadc0]',
  arctic: 'bg-gradient-to-br from-[#e8f4fb] to-[#9fc8e8]',
  neon: 'bg-gradient-to-br from-[#0d0d0d] to-[#ff007f]',
  slate: 'bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]',
  tropical: 'bg-gradient-to-br from-[#3d1c8c] to-[#00c9a7]',
  terminal: 'bg-[#000000]',
  autumn: 'bg-gradient-to-br from-[#5c2500] to-[#2b1200]',
  lofi: 'bg-gradient-to-br from-[#c4b5d0] to-[#d4b8a8]',
  alpine: 'bg-gradient-to-br from-[#f0f6ff] to-[#dceeff]',
};

export function ThemeSelector() {
  const { themeId, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const currentTheme = THEMES.find((t) => t.id === themeId);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change theme"
        className="flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 shadow-sm backdrop-blur-xl transition hover:bg-black/35"
      >
        <span
          className={`h-3 w-3 rounded-full ring-1 ring-white/30 ${THEME_SWATCHES[themeId]}`}
          aria-hidden="true"
        />
        {currentTheme?.label ?? themeId}
        <svg
          viewBox="0 0 10 6"
          className={`h-2.5 w-2.5 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-2xl border border-white/15 bg-black/50 py-1.5 shadow-xl backdrop-blur-2xl"
        >
          {THEMES.map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <li key={theme.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    setTheme(theme.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm transition hover:bg-white/10 ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full ring-1 ${
                      isActive ? 'ring-white' : 'ring-white/30'
                    } ${THEME_SWATCHES[theme.id]}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{theme.label}</span>
                  {isActive && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 shrink-0 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
