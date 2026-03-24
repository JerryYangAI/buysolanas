#!/bin/bash
# Deploy a satellite domain landing page
# Usage: ./deploy-satellite.sh <domain>
# Example: ./deploy-satellite.sh buysolana.ai

set -e

DOMAIN="$1"

if [ -z "$DOMAIN" ]; then
  echo "Usage: ./deploy-satellite.sh <domain>"
  echo ""
  echo "Available satellite domains:"
  echo "  buysolana.ai"
  echo "  smartsolana.cn"
  echo "  smartsolarsolana.cn"
  echo "  smartstakesolana.com"
  echo "  solarsolana.xyz"
  echo "  sssolana.com"
  echo "  stakesolana.cn"
  echo "  stakesolanas.com"
  echo "  upexisolana.com"
  exit 1
fi

# Convert domain to worker name (replace dots with dashes)
WORKER_NAME=$(echo "$DOMAIN" | tr '.' '-')

echo "================================================"
echo "  Deploying: $DOMAIN"
echo "  Worker:    $WORKER_NAME"
echo "================================================"

# Step 1: Build with the satellite domain set
echo ""
echo "[1/3] Building for $DOMAIN..."
NEXT_PUBLIC_SITE_DOMAIN="$DOMAIN" npx opennextjs-cloudflare build

# Step 2: Deploy using wrangler with overrides
echo ""
echo "[2/3] Deploying worker '$WORKER_NAME'..."
npx wrangler deploy \
  --name "$WORKER_NAME" \
  --var "NEXT_PUBLIC_SITE_DOMAIN:$DOMAIN" \
  --var "NEXT_PUBLIC_BASE_URL:https://$DOMAIN"

# Step 3: Remind about custom domain binding
echo ""
echo "[3/3] ✅ Deployed to: https://$WORKER_NAME.fordgyang8.workers.dev"
echo ""
echo "================================================"
echo "  NEXT STEPS — Bind custom domain:"
echo "================================================"
echo ""
echo "  1. Go to: https://dash.cloudflare.com"
echo "  2. Workers & Pages → '$WORKER_NAME'"
echo "  3. Settings → Domains & Routes"
echo "  4. Click 'Add' → Custom Domain"
echo "  5. Enter: $DOMAIN"
echo "  6. Cloudflare auto-configures DNS + SSL"
echo ""
echo "  After binding, $DOMAIN will serve the landing page!"
echo "================================================"
