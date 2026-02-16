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

## Cloudflare Pages (Git integration)

If deploying via Cloudflare Pages Git integration, set:

- **Build command:** `npx opennextjs-cloudflare build`
- **Build output directory:** `.open-next/assets`
- **Environment variables:** Add all variables listed above

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
