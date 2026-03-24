#!/bin/bash
# Deploy ALL satellite domains at once
# Usage: ./deploy-all-satellites.sh

set -e

SATELLITES=(
  "buysolana.ai"
  "smartsolana.cn"
  "smartsolarsolana.cn"
  "smartstakesolana.com"
  "solarsolana.xyz"
  "sssolana.com"
  "stakesolana.cn"
  "stakesolanas.com"
  "upexisolana.com"
)

echo "========================================="
echo "  Deploying ${#SATELLITES[@]} satellite domains"
echo "========================================="
echo ""

SUCCEEDED=0
FAILED=0

for DOMAIN in "${SATELLITES[@]}"; do
  echo ""
  echo "--- Deploying: $DOMAIN ---"
  if ./deploy-satellite.sh "$DOMAIN"; then
    SUCCEEDED=$((SUCCEEDED + 1))
  else
    echo "⚠️  FAILED: $DOMAIN"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "========================================="
echo "  SUMMARY"
echo "  ✅ Succeeded: $SUCCEEDED"
echo "  ❌ Failed:    $FAILED"
echo "========================================="
echo ""
echo "REMINDER: For each deployed worker, bind the custom domain:"
echo "  Cloudflare Dashboard → Workers & Pages → [worker] → Settings → Domains & Routes → Add Custom Domain"
