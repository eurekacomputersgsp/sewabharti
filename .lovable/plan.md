## Goal

The Lovable and GitHub codebases are already in sync (local `bun run build` succeeds and outputs `dist/` cleanly). The Cloudflare Pages build is failing, most likely due to package manager / Node version / config differences — not code differences. This plan applies the standard Pages compatibility fixes for a Vite + TanStack Router + React 19 project.

## What I'll change

1. **Pin Node version for Pages**
   - Add `.nvmrc` with `20` at repo root.
   - Add `NODE_VERSION=20` note in a new `CLOUDFLARE.md` for you to mirror in Pages → Settings → Environment variables (Cloudflare Pages defaults to Node 18, which breaks Vite 6 / React 19 installs).

2. **Force a package manager Pages understands**
   - Pages auto-detects `bun.lockb` but often falls back to npm and then chokes on React 19 peer deps. Two safe options; I'll implement option A and document B:
     - A. Add `packageManager: "bun@1.1.34"` field to `package.json` and keep `bun.lockb` committed so Pages uses Bun.
     - B. (Documented fallback) Override build command in Pages UI: `bun install && bun run build`.

3. **Fix SPA routing config**
   - Keep `public/_redirects` (already correct: `/* /index.html 200`).
   - Delete the stray `src/public/_redirects` — it never ships to `dist/` and only causes confusion.

4. **Prevent server-only file from being bundled**
   - `src/lib/config.server.ts` imports `node:process`. Nothing imports it today, but if Rollup ever picks it up Cloudflare's bundler will fail. I'll delete this unused file (it's a template leftover; this is an SPA with no server runtime).

5. **Verify env vars**
   - `src/integrations/supabase/client.ts` throws at runtime if `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are missing. You confirmed they're set in Pages — I'll add a short check in `CLOUDFLARE.md` reminding you they must be set for **both** Production and Preview environments (a common gotcha).

6. **Add a `CLOUDFLARE.md`** with the exact Pages settings that work:
   - Framework preset: **None**
   - Build command: `bun install && bun run build`
   - Build output directory: `dist`
   - Root directory: (blank)
   - Environment variables (Production + Preview): `NODE_VERSION=20`, `VITE_SUPABASE_URL=…`, `VITE_SUPABASE_PUBLISHABLE_KEY=…`, `VITE_SUPABASE_PROJECT_ID=…`

## What I need from you before/after

- **Ideal:** paste the last ~40 lines of the failing Cloudflare Pages build log so I can target the exact error instead of applying the generic fixes above.
- After I ship these changes, in the Cloudflare Pages dashboard:
  1. Set the build command and env vars as listed in `CLOUDFLARE.md`.
  2. Trigger a fresh deploy (not a retry of the old one — the config only re-reads on a new build).

## Out of scope

- No changes to routes, admin panel, Supabase schema, RLS, or UI.
- No changes to `vite.config.ts` unless the build log points at a Vite-specific error.
