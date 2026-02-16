# Deploying buysolanas.com to Cloudflare Pages

## Prerequisites

- Node.js 18+
- npm 9+
- Wrangler CLI (`npm i -g wrangler`)
- Cloudflare account with Pages enabled

## Environment Variables

### Public variables (set in `wrangler.toml` → `[vars]`)

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
npx wrangler pages secret put COINGECKO_API_KEY
```

Or set them in the Cloudflare Dashboard under:
**Pages → buysolanas → Settings → Environment variables**

## Build & Deploy

### Local preview

```bash
npm run pages:build && npm run preview
```

### Deploy to production

```bash
npm run deploy
```

This runs `@cloudflare/next-on-pages` to build, then `wrangler pages deploy` to push.

### First-time setup

1. Login to Wrangler:
   ```bash
   npx wrangler login
   ```

2. Create the Pages project (first deploy):
   ```bash
   npm run deploy
   ```
   Wrangler will prompt you to create a new project.

3. Set your custom domain in the Cloudflare Dashboard:
   **Pages → buysolanas → Custom domains → Add domain**

## Size Constraints

Cloudflare Pages has a **25MB deployment limit**.

After every build, verify:

```bash
npm run build && du -sh .next
```

- **Safe**: < 15MB
- **Warning**: 15–20MB (review and optimize)
- **Critical**: > 20MB (stop and reduce before deploying)

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
