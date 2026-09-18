# Copilot Instructions

TypeScript weather app that tracks Singapore locations and stores weather snapshots — Node/Express backend, React/Vite frontend, SQLite via Drizzle ORM.

## Dev URL

`http://weather-starter.localhost:1355`

## Commands

```bash
npm run dev          # Start Express + Vite dev server through Portless
npm test             # Run all backend tests (vitest, single run)
npx vitest run backend/src/routes/locations.test.ts  # Run a single test file
npm run doctor       # Verify /health and /api/locations are responding
npm run reset        # Delete backend/weather.db (wipe local data)
npm run db:generate  # Regenerate Drizzle migrations after schema changes
npm run db:migrate   # Apply migrations to backend/weather.db
```

## Architecture

Backend and frontend run as **one Node process** in development. Express handles `/api/*` and `/health`; Vite middleware serves the React SPA for everything else. The frontend always uses relative `/api` paths — no port configuration needed.

```
Browser → Portless proxy (:1355) → Express + Vite (random local port) → SQLite (backend/weather.db)
                                                                       → data.gov.sg API (external)
```

**Snapshot pattern:** Weather is never fetched on page load. It is written to SQLite only on location create and manual refresh.

## Detailed Instructions

- [Backend conventions](.github/instructions/BACKEND.instructions.md) — DB layer, error handling, external API, schema change workflow
- [Frontend conventions](.github/instructions/FRONTEND.instructions.md) — state management, interaction logging, shared types
- [Testing patterns](.github/instructions/TESTING.instructions.md) — supertest setup, stubbing, vitest config
