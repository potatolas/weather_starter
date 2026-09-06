# Weather Starter — Visual Themes

This document records every theme discussed, their design intent, and the implementation decisions made for each one. Themes that have been implemented are marked ✅.

---

## Architecture

Themes are driven by a `data-theme` attribute set on `<html>` by `ThemeProvider` ([`frontend/src/theme/index.tsx`](frontend/src/theme/index.tsx)). The active theme is persisted to `localStorage` under the key `weather-theme`.

Each theme defines a set of **CSS custom property tokens** in [`frontend/src/index.css`](frontend/src/index.css) and three **background layers** (`--theme-bg`, `--theme-bg-overlay-1`, `--theme-bg-overlay-2`). All UI components consume the tokens via Tailwind arbitrary-value classes (`text-[rgb(var(--ct-text-primary)/var(--ct-text-primary-o))]`).

### Colour tokens

| Token | Purpose |
|---|---|
| `--ct-text-primary` / `--ct-text-primary-o` | Main text — location name, temperature |
| `--ct-text-secondary` / `--ct-text-secondary-o` | Slightly dimmer — condition, data values |
| `--ct-text-muted` / `--ct-text-muted-o` | Labels, section headers, icons |
| `--ct-text-faint` / `--ct-text-faint-o` | Timestamps, footnotes |
| `--ct-card-bg` / `--ct-card-bg-o` | Card fill colour and opacity |
| `--ct-card-bg-alt-o` | Hover / alternate card fill opacity |
| `--ct-card-border` / `--ct-card-border-o` | Card border |
| `--ct-divider` / `--ct-divider-o` | Row separators, inner borders |
| `--ct-sidebar-bg` / `--ct-sidebar-bg-o` | Sidebar panel background |
| `--ct-sidebar-border` / `--ct-sidebar-border-o` | Sidebar right-edge border |
| `--ct-input-bg` / `--ct-input-bg-o` | Search & coordinate inputs |
| `--ct-input-border` / `--ct-input-border-o` | Input border |
| `--ct-accent-bg` / `--ct-accent-bg-o` | Primary action button fill (Add, Submit) |
| `--ct-accent-text` / `--ct-accent-text-o` | Primary action button text |
| `--ct-selected-bg` / `--ct-selected-bg-o` | Active sidebar card fill |
| `--ct-selected-border-o` | Active sidebar card border opacity |

### Structural tokens

These tokens control the visual shape and depth of every card component (`TileShell`, `TenDayForecast`, `HourlyStrip`, `SidebarCard`). They are applied via inline `style` props, which allows CSS custom properties to override hardcoded Tailwind utilities.

| Token | Purpose | Default (apple) |
|---|---|---|
| `--ct-card-radius` | `border-radius` of all cards | `1rem` (≈ `rounded-2xl`) |
| `--ct-card-blur` | `backdrop-filter` / `-webkit-backdrop-filter` | `blur(24px)` (≈ `backdrop-blur-xl`) |
| `--ct-card-shadow` | `box-shadow` on cards | `none` |
| `--ct-card-border-style` | CSS `border-style` | `solid` |

#### Per-theme structural values

| Theme | radius | blur | shadow | border-style |
|---|---|---|---|---|
| apple, obsidian, solar, forest, ocean, desert, tropical, autumn | `1rem` | `blur(24px)` | none | solid |
| blossom, lofi | `1.5rem` | `blur(8px)` | none | solid |
| arctic | `0.5rem` | `blur(8px)` | `0 4px 16px rgba(0,119,182,.15)` | solid |
| neon | `0.75rem` | `blur(4px)` | neon pink + teal glow | solid |
| slate | `0.375rem` | none | none | solid |
| terminal | `0` | none | none | **dashed** |
| alpine | `1rem` | `blur(4px)` | `0 4px 20px rgba(29,114,232,.12)` | solid |

### Adding a new theme

1. Add the id to the `ThemeId` union in `frontend/src/theme/index.tsx`
2. Push `{ id, label }` to the `THEMES` array in the same file
3. Add the swatch Tailwind class to `THEME_SWATCHES` in `frontend/src/components/ThemeSelector.tsx`
4. Add a `[data-theme='your-id']` block to `frontend/src/index.css` that sets **all colour tokens and all four structural tokens** above

---

## Implemented Themes

### ✅ 1. Apple
> *The original design — cool blue-steel glassmorphism.*

The default theme that ships with the app. Frosted-glass cards over a steel-blue atmospheric gradient, inspired by Apple's Weather app.

| Aspect | Detail |
|---|---|
| **Background** | `#6f8aa8 → #5a7591 → #4a627c → #3c5066` diagonal gradient; bright white radial at top-right, deep steel-blue radial at bottom-left |
| **Cards** | White at 8% opacity, `rounded-2xl`, heavy `backdrop-blur` |
| **Text** | Pure white at varying opacities (100% → 55%) |
| **Sidebar** | Black at 20% opacity with a 5% white border |
| **Accent button** | White at 90% opacity, slate-900 text |
| **Typography** | System sans-serif; extralight giant temperature; semibold labels |
| **Density** | Comfortable — generous padding and card gaps |
| **Theme id** | `apple` |

---

### ✅ 2. Midnight Obsidian
> *Deep near-black with indigo/violet accent glows — premium OLED-dark dashboard.*

A rich dark theme designed for nighttime use and OLED screens. Indigo and violet radial glows add depth without saturating the background. The existing glassmorphism card styling (`bg-white/8`, `border-white/15`) works without changes against the near-black base.

| Aspect | Detail |
|---|---|
| **Background** | `#0e0e1a → #0a0a12 → #080810`; indigo `rgba(99,76,230,0.28)` glow at top-right; violet `rgba(124,58,237,0.22)` glow at bottom-left |
| **Cards** | Same white-on-dark tokens as Apple — the near-black base makes them read as richer |
| **Text** | Pure white at varying opacities (same as Apple) |
| **Sidebar** | Same black/20 as Apple; deeper perceived contrast on the darker background |
| **Accent button** | White at 90% opacity, slate-900 text |
| **Typography** | Same as Apple |
| **Density** | Comfortable |
| **Theme id** | `obsidian` |

---

### ✅ 3. Solar Flare
> *Warm amber-to-coral gradient, cream card fills, dark brown text on light tiles.*

A light-on-dark-to-light inversion: this was the first theme requiring a full dark→light polarity switch, which drove the CSS token refactor across all 8 UI components. Cards are cream-coloured at high opacity; all text is deep brown.

| Aspect | Detail |
|---|---|
| **Background** | `#ff9a3c → #ff6b6b → #c0392b`; warm white radial at top-right; deep crimson radial at bottom-left |
| **Cards** | Amber-50 (`#fff3e0`) at 88% opacity — cream, warm, solid |
| **Text** | Deep brown `#3e1c00` at full opacity through to 55% |
| **Sidebar** | Same cream `#fff3e0` at 82% opacity |
| **Accent button** | Deep orange `#d93800` with white text |
| **Selected card** | Warm amber fill at 55% |
| **Typography** | Same system sans; warm-toned number displays |
| **Density** | Relaxed — proposed extra vertical breathing room |
| **Theme id** | `solar` |

**Design notes:** The token refactor was done here. All `text-white/*`, `bg-white/*`, `border-white/*` Tailwind classes across every component were replaced with CSS-var-based arbitrary classes. Obsidian and Apple were back-filled with equivalent token values so they render identically to before.

---

### ✅ 4. Forest Canopy
> *Deep forest greens, mossy tones, earthy neutrals — calm and grounded.*

Inspired by looking up through tree cover. Dark green backgrounds with layered radial glows in lime and emerald. Soft leaf-white text and moss-green secondary text carry the palette through every data element.

| Aspect | Detail |
|---|---|
| **Background** | `#1a2e1a → #243824 → #1e3020 → #162614`; soft lime radial at top-right; dark emerald pool at bottom-left |
| **Cards** | Dark forest green `rgb(45 80 40)` at 65% opacity |
| **Text primary** | Soft leaf-white `#e8f5e0` |
| **Text muted** | Moss green `#a3be8c` — labels and captions pick up the green palette |
| **Sidebar** | Deeper green `#1e3c1c` at 70% |
| **Accent button** | Vivid forest green `#589944` with leaf-white text |
| **Selected card** | Mid-green `#649b50` at 45% |
| **Typography** | Proposed: serif (Lora) for location/temperature, sans for data rows. Currently uses system sans (no font loading yet) |
| **Density** | Comfortable, slightly reduced gaps |
| **Theme id** | `forest` |

---

## Implemented Themes (continued)

The following themes were implemented after the initial four. All colour tokens **and** structural tokens (`--ct-card-radius`, `--ct-card-blur`, `--ct-card-shadow`, `--ct-card-border-style`) are set for each.

---

### ✅ 5. Deep Ocean
> *Dark teal-to-navy, bioluminescent cyan glow accents.*

| Aspect | Detail |
|---|---|
| **Colors** | `#0d2137 → #0a3d52` background, `#00d4ff` neon-cyan accents, `#e0f7fa` text |
| **Typography** | Monospaced (JetBrains Mono) for numbers; clean sans for labels |
| **Cards** | `rounded-2xl`, `bg-cyan-900/30`, `border-cyan-400/20`, strong backdrop blur |
| **Density** | Compact — tighter padding, more data visible at once |
| **Theme id** | `ocean` |

---

### ✅ 6. Desert Dusk
> *Terracotta and sand shading into deep mauve twilight — desert sunset.*

| Aspect | Detail |
|---|---|
| **Colors** | `#c0705a → #7a3f52 → #3d2040` gradient, sandy `#f5deb3` card surfaces |
| **Typography** | Thin/ultralight temperature; small-caps tracking for section labels |
| **Cards** | `rounded-2xl`, `bg-rose-950/50`, `border-rose-300/15`, light warm glow |
| **Density** | Comfortable |
| **Theme id** | `desert` |

---

### ✅ 7. Cherry Blossom
> *Soft pastel pinks and whites — Japanese spring aesthetics.*

| Aspect | Detail |
|---|---|
| **Colors** | `#ffe4ec → #ffc9d7 → #ffadc0` background, `#a0204e` accents, dark `#3a0d1f` text |
| **Typography** | Rounded humanist sans (DM Sans), medium weight, soft letter-spacing |
| **Cards** | `rounded-3xl`, `bg-white/80`, `border-pink-200`, subtle `shadow-pink-200/50` |
| **Density** | Relaxed — very spacious, almost minimal |
| **Theme id** | `blossom` |

---

### ✅ 8. Arctic Blizzard
> *Pure whites and ice blues — crisp cold-weather aesthetic.*

| Aspect | Detail |
|---|---|
| **Colors** | `#e8f4fb → #c9e4f5 → #9fc8e8` background, `#0077b6` accent, `#001f3f` text |
| **Typography** | Condensed sans (Barlow Condensed), bold for large figures |
| **Cards** | `rounded-lg` (sharper corners), `bg-white/85`, `border-blue-200`, crisp shadow |
| **Density** | Dense — compact padding, more information visible simultaneously |
| **Theme id** | `arctic` |

---

### ✅ 9. Neon Cityscape
> *Dark urban aesthetic with vivid neon accents — cyberpunk dashboard.*

| Aspect | Detail |
|---|---|
| **Colors** | `#0d0d0d` background, neon `#ff007f`, `#00ffcc`, `#aaff00` accents; white text |
| **Typography** | Geometric sans (Rajdhani), bold, tight tracking, glowing text-shadow |
| **Cards** | `rounded-xl`, `bg-gray-900/90`, colored `border-pink-500/50`, neon glow shadow |
| **Density** | Compact — information-dense, cyberdeck feel |
| **Theme id** | `neon` |

---

### ✅ 10. Stone & Slate
> *Muted neutral grays and charcoal — timeless editorial, broadsheet-like.*

| Aspect | Detail |
|---|---|
| **Colors** | `#2c2c2c → #1a1a1a` background, `#e8e4de` card fills, `#a0a0a0` secondary text |
| **Typography** | Serif (Playfair Display) for location/temp; thin sans for metadata |
| **Cards** | `rounded-md` (minimal rounding), `bg-neutral-100/10`, `border-neutral-400/20`, no blur |
| **Density** | Comfortable |
| **Theme id** | `slate` |

---

### ✅ 11. Tropical Horizon
> *Vivid Caribbean gradient — violet to turquoise, beachy and optimistic.*

| Aspect | Detail |
|---|---|
| **Colors** | `#3d1c8c → #0f9b8e → #00c9a7` gradient, `#fffde7` accents, white text |
| **Typography** | Rounded display (Poppins), bold headings, light body |
| **Cards** | `rounded-3xl`, `bg-white/12`, `border-teal-300/25`, soft glow |
| **Density** | Relaxed — big card sections, hero-first layout emphasis |
| **Theme id** | `tropical` |

---

### ✅ 12. Retro Terminal
> *Monochrome green phosphor on black — vintage CRT weather terminal.*

| Aspect | Detail |
|---|---|
| **Colors** | `#000000` background, `#00ff41` phosphor green, dim `#007a1e` secondary text |
| **Typography** | Monospace only (Fira Code or Courier), uppercase labels, no font mixing |
| **Cards** | `rounded-none`, `bg-transparent`, `border-green-500/60` dashed, no blur |
| **Density** | Dense — compact rows, terminal-list style |
| **Theme id** | `terminal` |

---

### ✅ 13. Autumn Harvest
> *Burnt oranges, deep golds, burgundy reds — cozy October overcast sky.*

| Aspect | Detail |
|---|---|
| **Colors** | `#2b1200 → #5c2500` background, `#e07a1e` amber accents, `#fde68a` text |
| **Typography** | Slab serif (Roboto Slab) for temp/location; regular sans for data |
| **Cards** | `rounded-2xl`, `bg-orange-950/50`, `border-orange-400/20`, warm inner glow |
| **Density** | Comfortable |
| **Theme id** | `autumn` |

---

### ✅ 14. Lo-Fi Pastel
> *Desaturated dusty pastels — lavender, sage, peach — analog lo-fi aesthetic.*

| Aspect | Detail |
|---|---|
| **Colors** | `#c4b5d0 → #a8c4b8 → #d4b8a8` gradient, `#3d2f4a` dark text, muted pastel accents |
| **Typography** | Rounded sans (Quicksand), soft weight, generous line-height |
| **Cards** | `rounded-3xl`, `bg-white/55` with CSS noise texture overlay, `border-purple-100/60` |
| **Density** | Relaxed — minimal data shown per card, airy whitespace |
| **Theme id** | `lofi` |

---

### ✅ 15. Alpine White
> *Bright high-contrast light mode — snow-covered mountain clarity.*

| Aspect | Detail |
|---|---|
| **Colors** | `#f0f6ff → #dceeff` background, `#1d72e8` accent, `#1a2a3a` dark text |
| **Typography** | Clean humanist sans (Inter), regular weight, standard tracking |
| **Cards** | `rounded-2xl`, `bg-white/95`, `border-blue-100`, sharp drop shadow `shadow-blue-200/40` |
| **Density** | Comfortable — light mode baseline, standard visual weight |
| **Theme id** | `alpine` |
