# Vynora / GrowBond

Single-window citizen services + industrial contracting platform.
Production: **https://growbond.in**

Planning docs (01_PRD → 06_Plan) ei project-er bahire chhilo; ei repo shudhu code.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, RLS, Auth, Storage)
- Cloudflare Workers via OpenNext (hosting) + Turnstile (bot protection)
- Resend (admin email alert)
- Zod (client + server validation)

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # values fill koro
npm run dev                  # http://localhost:3000
```

Local-e Turnstile test key use korun (`.env.example`-e dewa ache) — ota sob somoy pass kore.

## Supabase setup

1. Supabase dashboard → **SQL Editor** → `supabase/migrations/0001_init.sql` paste → **Run**
2. `0002_seed.sql` → **Run** (dev-e; prod-e category part-e)
3. **Storage** → New bucket: `lead-attachments` (Private)
4. **Authentication → Users → Add user** — owner account toiri koro
5. SQL Editor-e:
   ```sql
   insert into public.admin_profiles (id, full_name, role)
   values ('<owner-user-uuid>', 'Mritunjoy', 'owner');
   ```
6. (Optional) Database → Extensions → `pg_cron` enable → `0003_cron_archive.sql` run

## Environment variables

| Variable | Where | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Local + Cloudflare | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Local + Cloudflare | No (RLS protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | Local + Cloudflare (Production) | **YES** — kokhono commit/NEXT_PUBLIC na |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Local + Cloudflare | No |
| `TURNSTILE_SECRET_KEY` | Local + Cloudflare | **YES** |
| `RESEND_API_KEY` | Local + Cloudflare | **YES** |
| `ADMIN_NOTIFY_EMAIL` | Local + Cloudflare | No |
| `LEAD_FROM_EMAIL` | Local + Cloudflare | No |
| `NEXT_PUBLIC_SITE_URL` | Local + Cloudflare | No |

> **Important:** `NEXT_PUBLIC_*` variables build-time-e frontend-e bake hoy. Cloudflare-e ei value change korle abar build (redeploy) korte hobe.

## Deploy to Cloudflare Workers (GitHub Actions)

> Cloudflare Pages-er `next-on-pages` adapter archived (Sep 2025). Ekhon `@opennextjs/cloudflare` diye Workers-e deploy hoy,
> ar API route-e `runtime = 'edge'` lage na (Node runtime). Next 14 OpenNext-e sunset, tai Next 15-e upgrade kora hoyeche.

1. GitHub-e private repo `vynora` banan, code push korun (`main` = production, `dev` = CI check).
2. GitHub repo → **Settings → Secrets and variables → Actions**:
   - **Variables** (public): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secrets**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`, `LEAD_FROM_EMAIL`
3. Cloudflare API token: dash → My Profile → API Tokens → **Edit Cloudflare Workers** template (Account + Zone resources: growbond.in).
4. `main`-e push korle `.github/workflows/deploy.yml` build kore deploy kore. `wrangler.jsonc`-er `routes` growbond.in custom domain nijei jore dey
   (growbond.in Cloudflare-e **Active** thaka lagbe).
5. Local preview (Workers runtime): `cp .dev.vars.example .dev.vars` → value fill → `npm run preview`.

> `NEXT_PUBLIC_*` build-time-e bake hoy; change korle abar deploy (push / Run workflow) korte hobe.
> Prothom `npm install`-er por notun `package-lock.json` commit korben.
> Workers free plan-e bundle size limit ache; size error ashle paid plan lagte pare.

## Security notes

- RLS enable ache sob table-e. Anon key diye lead read kora jay na.
- Service role key sudhu server-side route-e use hoy. `src/lib/supabase/admin.ts` `server-only` diye guard kora.
- Turnstile token server-e verify hoy (`src/lib/turnstile.ts`) before any DB write.
- Honeypot field (`website`) — bot filled korle silent success, kono save nai.
- Security headers `next.config.mjs`-e (CSP, X-Frame-Options, HSTS).
- `/admin/*` middleware-e protect (`src/middleware.ts`) + RLS.
- Rate limit: Cloudflare WAF-e `/api/leads/*` rule add korben (dashboard theke, code-e nei).

## Project structure

```
src/
  app/            routes (public pages, /admin, /api)
  components/     layout, forms, modals (floating windows), admin
  data/           service catalogue + B2B field definitions
  schemas/        Zod schemas (client + server)
  lib/            supabase clients, turnstile, email, reference id
  middleware.ts   admin route guard
supabase/
  migrations/     SQL (schema, seed, cron)
```

## TODO (MVP-er baire / next step)

- [ ] Service detail page `/citizen-services/[slug]`
- [ ] Attachment upload (Supabase Storage signed upload) — schema ready, UI-te add korte hobe
- [ ] Vitest unit tests + Playwright e2e
- [ ] Cloudflare Email Routing for `support@growbond.in`
- [ ] Sentry (Phase 2)

## Known limitations (intentional MVP scope)

- Citizen ar B2B form-e attachment upload UI nei (DB + storage ready).
- Admin-e lead assign/notes UI basic.
- Light theme nei.
