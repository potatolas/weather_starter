import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type ThemeId =
  | 'apple'
  | 'obsidian'
  | 'solar'
  | 'forest'
  | 'ocean'
  | 'desert'
  | 'blossom'
  | 'arctic'
  | 'neon'
  | 'slate'
  | 'tropical'
  | 'terminal'
  | 'autumn'
  | 'lofi'
  | 'alpine';

export interface Theme {
  id: ThemeId;
  label: string;
}

export const THEMES: Theme[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'obsidian', label: 'Midnight Obsidian' },
  { id: 'solar', label: 'Solar Flare' },
  { id: 'forest', label: 'Forest Canopy' },
  { id: 'ocean', label: 'Deep Ocean' },
  { id: 'desert', label: 'Desert Dusk' },
  { id: 'blossom', label: 'Cherry Blossom' },
  { id: 'arctic', label: 'Arctic Blizzard' },
  { id: 'neon', label: 'Neon Cityscape' },
  { id: 'slate', label: 'Stone & Slate' },
  { id: 'tropical', label: 'Tropical Horizon' },
  { id: 'terminal', label: 'Retro Terminal' },
  { id: 'autumn', label: 'Autumn Harvest' },
  { id: 'lofi', label: 'Lo-Fi Pastel' },
  { id: 'alpine', label: 'Alpine White' },
];

const STORAGE_KEY = 'weather-theme';
const DEFAULT_THEME: ThemeId = 'apple';

function readTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) return stored as ThemeId;
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}

interface ThemeContextValue {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(readTheme);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  // Apply data-theme attribute to <html> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
  }, [themeId]);

  // Apply on mount (SSR-safe)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', readTheme());
  }, []);

  return <ThemeContext.Provider value={{ themeId, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
