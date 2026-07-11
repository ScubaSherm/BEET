# BEET — Baldwin Family Preparedness Tracker

Client-only PWA (Vite + React + TypeScript). No backend, no auth, no login.

- All data lives in the browser's `localStorage` (`egimt:v1` key, see `src/lib/storage.ts`). Do not introduce Supabase, Firebase, or any hosted database/auth service — keep this app backend-free by design.
- Anyone who opens the site can view and edit inventory data immediately with no sign-in. Edits are local to that browser/device only; there is no sync between devices.
- `public/sw.js` provides offline support via a service worker. It fetches network-first and falls back to cache when offline, so new deploys are picked up promptly. Bump `CACHE_NAME` if you need to force-invalidate stale caches on users' devices.
- Deployed to GitHub Pages via `.github/workflows/deploy-pages.yml` on every push to `main`.
