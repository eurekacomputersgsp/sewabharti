# Cloudflare Pages — Deployment Settings

Use these exact settings in Cloudflare Pages → your project → **Settings → Builds & deployments**.

## Build configuration

| Field | Value |
|---|---|
| Framework preset | **None** |
| Build command | `bun install && bun run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |

## Environment variables

Set these under **Settings → Environment variables** for **both Production and Preview**:

| Name | Value |
|---|---|
| `NODE_VERSION` | `20` |
| `VITE_SUPABASE_URL` | `https://pxwogczcbwaxhuidhqbq.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(the anon key from your `.env`)* |
| `VITE_SUPABASE_PROJECT_ID` | `pxwogczcbwaxhuidhqbq` |

> All three `VITE_*` vars are required — the Supabase client throws at runtime if any is missing.
> A missing Preview env is the #1 cause of "works on Production but preview branches are blank".

## SPA routing

`public/_redirects` contains `/* /index.html 200` — this is what makes deep links (e.g. `/admin`, `/verify`) work on refresh. Do not delete it.

## After changing settings

Cloudflare only re-reads build config on a **new** deploy. Trigger a fresh deploy from the Deployments tab — don't just "Retry" the old failed one.

## Troubleshooting

- **`ERESOLVE` / peer-dependency errors** → build command isn't using Bun. Confirm it's `bun install && bun run build` (not `npm install`).
- **`Cannot find module 'node:process'` or similar** → shouldn't happen anymore (removed `src/lib/config.server.ts`). If it reappears, some new code is importing a `.server.ts` file — remove that import.
- **Blank white page after successful build** → env vars are missing on that environment. Open browser DevTools → Console; the Supabase client logs a clear error.
- **404 on `/admin` refresh** → `_redirects` was deleted or the output directory is wrong. Must be `dist`.
