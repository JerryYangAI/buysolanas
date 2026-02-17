# Deploying buysolanas.com to Cloudflare Workers

## Prerequisites

- Node.js 18+
- npm 9+
- Wrangler CLI (included as devDependency)
- Cloudflare account

## Architecture

This project uses **@opennextjs/cloudflare** (OpenNext) to deploy Next.js to Cloudflare Workers with full Node.js compatibility. This replaces the deprecated `@cloudflare/next-on-pages`.

## Environment Variables

### Public variables (set in `wrangler.jsonc` → `vars`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | `https://buysolanas.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### Secrets (set via Cloudflare Dashboard or CLI)

| Secret | Description |
|---|---|
| `COINGECKO_API_KEY` | CoinGecko API key for live prices |

Set secrets via CLI:

```bash
npx wrangler secret put COINGECKO_API_KEY
```

Or set them in the Cloudflare Dashboard under:
**Workers & Pages → buysolanas → Settings → Variables and Secrets**

## Build & Deploy

### Local preview (Workers runtime)

```bash
npm run preview
```

### Deploy to production

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy`.

### First-time setup

1. Login to Wrangler:
   ```bash
   npx wrangler login
   ```

2. Deploy (first deploy creates the Worker):
   ```bash
   npm run deploy
   ```

3. Set your custom domain in the Cloudflare Dashboard:
   **Workers & Pages → buysolanas → Settings → Domains & Routes**

## Cloudflare Workers Builds (Git integration)

> **Important:** This project uses `@opennextjs/cloudflare` which deploys to **Cloudflare Workers**, NOT Cloudflare Pages. Do not create a Pages project — it will result in 404 errors because Pages cannot serve the Worker bundle.

To deploy via Git integration (auto-deploy on push):

1. Go to **Cloudflare Dashboard → Workers & Pages → Create**
2. Select **"Import a repository"** and connect your GitHub repo
3. Configure build settings:
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx wrangler deploy`
   - **Build output directory:** (leave empty — Wrangler handles this)
4. Set environment variables in **Settings → Variables and Secrets**:
   - Add all `NEXT_PUBLIC_*` variables listed above
   - Add `COINGECKO_API_KEY` as a secret
5. Ensure **Settings → Runtime → Compatibility flags** includes `nodejs_compat`
6. Ensure **Settings → Runtime → Compatibility date** is `2025-12-01` or later

## Supabase Setup

Create the `questions` table:

```sql
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_type TEXT NOT NULL,
  goal TEXT NOT NULL,
  stuck_point TEXT NOT NULL,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public reads"
  ON questions FOR SELECT
  USING (true);
```
