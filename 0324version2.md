# BuySolanas V2.0 — Development Summary (2026-03-24)

> **Repo:** https://github.com/JerryYangAI/buysolanas
> **Live:** https://buysolanas.com
> **Tech Stack:** Next.js 16 + TypeScript + Tailwind CSS 4 + Cloudflare Workers

---

## What Was Built

### Phase 0: Domain Cluster + Portfolio (Completed)

**Goal:** Monetize 10 Solana-related domains via a cross-linked domain cluster.

| Feature | Files | Status |
|---------|-------|--------|
| Domain config (10 domains, slogans, features, colors) | `src/lib/domain-config.ts` | ✅ |
| Domain portfolio showcase on homepage | `src/components/DomainShowcase.tsx` | ✅ |
| Domain cluster cross-linking component | `src/components/DomainCluster.tsx` | ✅ |
| `/domains` page with inquiry form | `src/app/[locale]/domains/page.tsx`, `DomainInquiryForm.tsx` | ✅ |
| Domain inquiry API | `src/app/api/domains/inquire/route.ts` | ✅ |
| Satellite landing page template | `src/app/[locale]/page.tsx` (SatelliteLanding function) | ✅ |
| Deployment scripts | `deploy-satellite.sh`, `deploy-all-satellites.sh` | ✅ |

**10 Domains Deployed to Cloudflare Workers:**

| Domain | Worker Name | Status |
|--------|-------------|--------|
| buysolanas.com | buysolanas | ✅ Main site |
| buysolana.ai | buysolana-ai | ✅ Custom domain bound |
| smartsolana.cn | smartsolana-cn | ✅ Deployed |
| smartsolarsolana.cn | smartsolarsolana-cn | ✅ Deployed |
| smartstakesolana.com | smartstakesolana-com | ✅ Deployed |
| solarsolana.xyz | solarsolana-xyz | ✅ Deployed |
| sssolana.com | sssolana-com | ✅ Deployed |
| stakesolana.cn | stakesolana-cn | ✅ Deployed |
| stakesolanas.com | stakesolanas-com | ✅ Deployed |
| upexisolana.com | upexisolana-com | ✅ Deployed |

**Note:** Each satellite domain needs custom domain binding in Cloudflare Dashboard → Workers & Pages → [worker] → Settings → Domains & Routes → Add Custom Domain. `buysolana.ai` was bound successfully; others need the same step.

---

### Phase 1: Design + Ticker + Landing + Glossary (Completed)

**Goal:** Solana brand identity, live price data, V2 landing page, 50 glossary terms.

| Feature | Files | Status |
|---------|-------|--------|
| Solana brand colors (#9945FF, #14F195, #00C2FF) | `src/app/globals.css` | ✅ |
| Space Grotesk font (English) | `src/app/[locale]/layout.tsx` | ✅ |
| SOL Ticker Bar (live CoinGecko, 30s polling) | `src/components/TickerBar.tsx` | ✅ |
| SOL Price Card (hero widget) | `src/components/SolPriceCard.tsx` | ✅ |
| V2 Landing Page (hero, features, learning path, glossary preview, news, community CTA) | `src/app/[locale]/page.tsx` | ✅ |
| Enhanced glossary page (A-Z nav, search, category filters) | `src/app/[locale]/glossary/page.tsx`, `GlossaryClient.tsx` | ✅ |
| Multi-column footer with newsletter + domain links | `src/components/Footer.tsx` | ✅ |
| Gradient logo, Solana-branded header | `src/components/Header.tsx` | ✅ |
| New slogan: 「从零到 Solana，你的 Web3 第一站」 | `messages/en.json`, `messages/zh-CN.json` | ✅ |

---

### Phase 2: Courses + Newsletter + Glossary Expansion (Completed)

**Goal:** Level 1 courses, newsletter subscription, glossary to 200 terms.

| Feature | Files | Status |
|---------|-------|--------|
| Level 1 courses (6 lessons, bilingual) | `content/course/{en,zh-CN}/lesson-{1-6}.mdx` | ✅ |
| Enhanced course page (3-level system, badges, stats) | `src/app/[locale]/course/page.tsx` | ✅ |
| Newsletter subscription form (card + inline variants) | `src/components/NewsletterForm.tsx` | ✅ |
| Newsletter API endpoint | `src/app/api/newsletter/subscribe/route.ts` | ✅ |
| Newsletter in footer | `src/components/Footer.tsx` | ✅ |
| Glossary expanded to 200 bilingual terms | `content/glossary/{en,zh-CN}/*.mdx` (400 files) | ✅ |
| Glossary term page styling (colored badges, glass-card related terms) | `src/app/[locale]/glossary/[term]/page.tsx` | ✅ |

---

### Phase 3: Advanced Content + Rewards + SOL Detail (Completed)

**Goal:** Complete course system, points/rewards, SOL price detail page, Discord.

| Feature | Files | Status |
|---------|-------|--------|
| Level 2 courses (6 lessons, bilingual) | `content/course/{en,zh-CN}/lesson-{7-12}.mdx` | ✅ |
| Level 3 courses (5 lessons, bilingual) | `content/course/{en,zh-CN}/lesson-{13-17}.mdx` | ✅ |
| SOL price detail page (interactive chart, market stats, staking, ecosystem tokens) | `src/app/[locale]/prices/sol/page.tsx`, `SolDetailClient.tsx` | ✅ |
| Points & rewards page (earn/redeem tables, balance card) | `src/app/[locale]/rewards/page.tsx` | ✅ |
| Discord CTA component | `src/components/DiscordCTA.tsx` | ✅ |
| "Rewards" nav link added | `src/components/Header.tsx` | ✅ |

---

### Critical Bug Fix: Edge Runtime Compatibility (Completed)

**Problem:** Cloudflare Workers (Edge runtime) doesn't support Node.js `fs` module. This caused:
- Glossary list showed "0 terms"
- Course/glossary detail pages showed "Internal Server Error"

**Solution:** Build-time content pre-compilation pipeline:

1. `scripts/prebuild-content.mjs` — Runs at build time (Node.js), reads all 434 MDX files, converts Markdown → HTML using `remark`, outputs `src/lib/content-manifest.json`
2. `src/lib/mdx.ts` — Imports the JSON manifest at runtime, no `fs` needed
3. `src/components/mdx/MdxContent.tsx` — Renders pre-built HTML via `dangerouslySetInnerHTML`, no runtime MDX compilation
4. `package.json` — `prebuild` script runs automatically before `dev` and `build`

**Build command chain:** `node scripts/prebuild-content.mjs` → `next build` → `opennextjs-cloudflare build` → `wrangler deploy`

---

## Content Statistics

| Content Type | Count | Files |
|-------------|-------|-------|
| Course lessons (3 levels, bilingual) | 17 lessons | 34 MDX files |
| Glossary terms (bilingual) | 200 terms | 400 MDX files |
| **Total MDX content** | | **434 files** |

### Glossary Categories (200 terms)
- Solana-specific: 40 (PoH, Sealevel, Turbine, Jupiter, Phantom, Jito, etc.)
- DeFi: 35 (AMM, TVL, APY, Lending, Flash Loan, etc.)
- NFT & Digital Assets: 20 (Floor Price, Metadata, Compressed NFT, etc.)
- Trading & Wallets: 28 (Gas Fee, Seed Phrase, Staking, DEX, etc.)
- Security & Risk: 21 (Rug Pull, Phishing, MEV, Sandwich Attack, etc.)
- Community & Culture: 15 (HODL, WAGMI, GM, Degen, etc.)
- Blockchain Basics: 15 (Consensus, PoW, PoS, Finality, etc.)
- Web3 Concepts: 15 (dApp, Smart Contract, Layer 1/2, ZK Proof, etc.)
- Investment: 11 (Market Cap, Tokenomics, Vesting, etc.)

### Course Levels (17 lessons)
- **Level 1 — Beginner (6):** Blockchain basics, Why Solana, Phantom wallet, Buy SOL, Ecosystem overview, Common mistakes
- **Level 2 — Intermediate (6):** Jupiter DEX, DeFi overview, SOL staking, NFTs, Scam identification, On-chain analysis
- **Level 3 — Advanced (5):** Liquidity provision, Validator selection, Helius API, Solana programs, DeFi tax

---

## All Page Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | V2 Landing (main) / Satellite Landing (others) | ✅ |
| `/prices` | Live crypto prices (100 coins, CoinGecko Pro) | ✅ |
| `/prices/sol` | SOL detail (chart, stats, staking, ecosystem) | ✅ |
| `/start` | Quick start guide | ✅ |
| `/course` | Course list (3 levels, 17 lessons) | ✅ |
| `/course/[step]` | Course lesson detail | ✅ |
| `/glossary` | Glossary list (A-Z, search, categories) | ✅ |
| `/glossary/[term]` | Glossary term detail | ✅ |
| `/community` | Community questions (needs Supabase) | ✅ |
| `/ask` | Submit question (needs Supabase) | ✅ |
| `/domains` | Domain portfolio + inquiry form | ✅ |
| `/rewards` | Points & rewards system | ✅ |
| `/landing` | Satellite domain landing template | ✅ |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat assistant (content search) |
| `/api/ask` | POST | Submit question (Supabase) |
| `/api/domains/inquire` | POST | Domain inquiry (Supabase/console) |
| `/api/newsletter/subscribe` | POST | Newsletter subscription |

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `COINGECKO_API_KEY` | Cloudflare secret | CoinGecko Pro API key (`CG-xxx`) |
| `NEXT_PUBLIC_BASE_URL` | wrangler.jsonc | `https://buysolanas.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | wrangler.jsonc | Supabase project URL (not yet configured) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | wrangler.jsonc | Supabase anon key (not yet configured) |
| `NEXT_PUBLIC_SITE_DOMAIN` | Per satellite deploy | e.g. `buysolana.ai` (main site omits this) |

**CoinGecko API Key (Pro):** `CG-7ZicZ17d3P2wpHVbfBuk7rwc`
Set via: `echo "CG-7ZicZ17d3P2wpHVbfBuk7rwc" | npx wrangler secret put COINGECKO_API_KEY`

---

## Deployment Commands

### Main site (buysolanas.com)
```bash
node scripts/prebuild-content.mjs   # Compile 434 MDX → JSON
npx opennextjs-cloudflare build      # Build for Cloudflare
npx wrangler deploy                  # Deploy main worker
```

### Single satellite domain
```bash
./deploy-satellite.sh buysolana.ai
```

### All satellite domains
```bash
./deploy-all-satellites.sh
```

### After deploying satellite workers — bind custom domain
1. Cloudflare Dashboard → Workers & Pages → [worker name]
2. Settings → Domains & Routes → Add → Custom Domain
3. Enter domain (e.g. `smartsolana.cn`)
4. DNS + SSL auto-configured (domains registered on Cloudflare)

---

## What's NOT Done Yet / Known Issues

### Not Configured
- **Supabase** — URL and key are empty. Affects: `/ask` form submission, `/community` questions display, domain inquiry storage, newsletter subscriber storage. All have console.log fallbacks.
- **Discord** — Invite link is placeholder (`https://discord.gg/buysolanas`). Need actual Discord server created.
- **Satellite custom domains** — Only `buysolana.ai` has been bound. Other 8 need the same Cloudflare Dashboard step.

### Not Yet Built (Future Phases)
- **User authentication** (Supabase Auth — email + Google OAuth)
- **User profiles** (learning progress dashboard, badges, saved terms)
- **Points system backend** (API for earning/spending points, Supabase tables)
- **Newsletter email sending** (Resend integration, welcome sequence)
- **Quiz scoring backend** (currently Quiz component is static/client-only)
- **Glossary search** — search box works but only searches title/description, not full content
- **SEO** — sitemap includes all pages but JSON-LD could be expanded; Google Search Console not verified
- **Analytics** — No Plausible or GA installed yet
- **Course progress tracking** — UI exists but needs auth + Supabase tables

### Known Technical Debt
- `content-manifest.json` is 1.1 MB — gets bundled into the worker. As content grows to 500+ terms, may need to split or lazy-load
- `next-mdx-remote` is still in `package.json` but no longer used at runtime (can be removed)
- Some MDX files have `<Quiz>` components that are stripped during pre-build — quiz functionality needs a client-side approach
- Ticker Bar uses client-side CoinGecko fetch without API key (rate-limited). Server-side caching would be better.

---

## File Structure Overview

```
buysolanas-main/
├── content/
│   ├── course/
│   │   ├── en/ (17 lessons)
│   │   └── zh-CN/ (17 lessons)
│   └── glossary/
│       ├── en/ (200 terms)
│       └── zh-CN/ (200 terms)
├── messages/
│   ├── en.json
│   └── zh-CN.json
├── scripts/
│   └── prebuild-content.mjs
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx (V2 landing / satellite landing)
│   │   │   ├── course/ (list + [step] detail)
│   │   │   ├── glossary/ (list + [term] detail + GlossaryClient)
│   │   │   ├── prices/ (list + sol/ detail)
│   │   │   ├── domains/ (portfolio + inquiry form)
│   │   │   ├── rewards/ (points & rewards)
│   │   │   ├── start/ (quick start)
│   │   │   ├── community/ (questions list)
│   │   │   ├── ask/ (submit question form)
│   │   │   └── landing/ (satellite template)
│   │   ├── api/
│   │   │   ├── chat/route.ts
│   │   │   ├── ask/route.ts
│   │   │   ├── domains/inquire/route.ts
│   │   │   └── newsletter/subscribe/route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TickerBar.tsx
│   │   ├── SolPriceCard.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── NewsletterForm.tsx
│   │   ├── DomainShowcase.tsx
│   │   ├── DomainCluster.tsx
│   │   ├── DiscordCTA.tsx
│   │   ├── Sparkline.tsx
│   │   └── mdx/ (MdxContent, Quiz, Toc, Disclaimer)
│   ├── lib/
│   │   ├── mdx.ts (reads from content-manifest.json)
│   │   ├── content-manifest.json (auto-generated, 1.1 MB)
│   │   ├── coingecko.ts
│   │   ├── domain-config.ts
│   │   ├── supabase.ts
│   │   └── format.ts
│   └── i18n/
│       ├── routing.ts
│       ├── navigation.ts
│       └── request.ts
├── v2/
│   ├── buysolanas_v2_plan.md
│   └── buysolanas_v2_landing.html
├── deploy-satellite.sh
├── deploy-all-satellites.sh
├── wrangler.jsonc
└── package.json
```

---

## Git History (Key Commits)

```
e8230cc  V1: Redesign UI + fix CoinGecko API + create /start page
fdb6a1b  Phase 0: Domain portfolio showcase, inquiry system, satellite landing
3f01af8  Phase 1: Solana brand redesign, Ticker Bar, V2 landing page
1ef6e69  Phase 1: Add 50 bilingual glossary terms (100 MDX)
6982f5a  Phase 2: Enhanced course page, newsletter system, SEO
4c8cb1b  Phase 2: Complete Level 1 bilingual course content (12 MDX)
05f66f3  Phase 3: SOL detail page, rewards system, Discord, Level 2&3 courses, glossary expansion to 200
e5981b4  Fix: prebuild MDX content to JSON manifest (Edge runtime compatibility)
6c6c76c  Fix: pre-render MDX to HTML at build time (detail pages)
```

---

*Last updated: 2026-03-24*
