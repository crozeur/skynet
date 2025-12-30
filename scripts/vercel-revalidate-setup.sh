#!/usr/bin/env bash
#
# Production-Grade Vercel Environment Setup for REVALIDATE_SECRET
#
# ⚠️  SECURITY WARNINGS:
# - Do NOT commit secrets to version control
# - Shell history can leak secrets - use: REVALIDATE_SECRET=xxx ./script.sh
# - Store REVALIDATE_SECRET in a secure password manager (1Password, Bitwarden, etc.)
# - By default, this script does NOT print the secret (use --print-secret to override)
# - Never run with --print-secret in CI/CD logs
#
# Usage:
#   ./scripts/vercel-revalidate-setup.sh [OPTIONS]
#
# Options:
#   -h, --help        Show this help message
#   --dry-run         Print commands without executing (safe preview)
#   --print-secret    Print the secret at the end (NOT recommended for CI)
#   --skip-deploy     Skip production deployment (only update env vars)
#   --skip-test       Skip curl endpoint test

set -euo pipefail

# Usage/help message
usage() {
  cat << 'EOF'
Vercel Revalidation Setup Script

Automates the setup of REVALIDATE_SECRET for Next.js on-demand revalidation.

Usage:
  ./scripts/vercel-revalidate-setup.sh [OPTIONS]

Options:
  -h, --help        Show this help message
  --dry-run         Print commands without executing (safe preview)
  --print-secret    Print the secret at the end (NOT recommended for CI)
  --skip-deploy     Skip production deployment (only update env vars)
  --skip-test       Skip curl endpoint test

Examples:
  ./scripts/vercel-revalidate-setup.sh --dry-run
  ./scripts/vercel-revalidate-setup.sh --print-secret
  REVALIDATE_SECRET=xxx ./scripts/vercel-revalidate-setup.sh

Security:
  - Secrets are NOT printed by default (use --print-secret to override)
  - Store secrets in a password manager, not in shell history
  - Use environment variable to pass existing secrets

EOF
  exit 0
}

# Parse flags
DRY_RUN=false
PRINT_SECRET=false
SKIP_DEPLOY=false
SKIP_TEST=false

for arg in "$@"; do
  case $arg in
    -h|--help)
      usage
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --print-secret)
      PRINT_SECRET=true
      shift
      ;;
    --skip-deploy)
      SKIP_DEPLOY=true
      shift
      ;;
    --skip-test)
      SKIP_TEST=true
      shift
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Run with --help for usage information"
      exit 1
      ;;
  esac
done

# Helper function to run commands (respects --dry-run)
run() {
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] $*"
  else
    "$@"
  fi
}

echo "=========================================="
echo "Vercel Revalidation Setup Script"
echo "=========================================="
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN MODE - No changes will be made"
  echo ""
fi

# Step 1: Check we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Error: Not inside a git repository"
  echo "   This script must be run from the project root"
  exit 1
fi

echo "✓ Git repository detected"

# Step 2: Check Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Error: Vercel CLI not found"
  echo ""
  echo "Install it with:"
  echo "  npm i -g vercel"
  exit 1
fi

echo "✓ Vercel CLI installed"

# Step 3: Check user is logged in
if [ "$DRY_RUN" = false ]; then
  if ! vercel whoami &> /dev/null; then
    echo "❌ Error: Not logged in to Vercel"
    echo ""
    echo "Login with:"
    echo "  vercel login"
    exit 1
  fi
  
  VERCEL_USER=$(vercel whoami 2>/dev/null || echo "unknown")
  echo "✓ Logged in as: $VERCEL_USER"
else
  echo "✓ Skipping login check (dry-run)"
fi

# Step 4: Check project is linked
if [ ! -f ".vercel/project.json" ]; then
  echo "❌ Error: Project not linked to Vercel"
  echo ""
  echo "Link this project first:"
  echo "  vercel link"
  exit 1
fi

if command -v node &> /dev/null && [ -f ".vercel/project.json" ]; then
  PROJECT_ID=$(node -e "console.log(require('./.vercel/project.json').projectId)" 2>/dev/null || echo "unknown")
  echo "✓ Project linked: $PROJECT_ID"
else
  echo "✓ Project linked (.vercel/project.json exists)"
fi
echo ""

# Step 5: Generate or use existing REVALIDATE_SECRET
if [ -n "${REVALIDATE_SECRET:-}" ]; then
  echo "✓ Using existing REVALIDATE_SECRET from environment"
  SECRET_LENGTH=${#REVALIDATE_SECRET}
  echo "  Secret length: $SECRET_LENGTH characters"
else
  echo "Generating new REVALIDATE_SECRET..."
  
  # Check if Node.js is available
  if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js not found (required for secret generation)"
    echo "   Either install Node.js or set REVALIDATE_SECRET manually:"
    echo "   REVALIDATE_SECRET=your-secret ./scripts/vercel-revalidate-setup.sh"
    exit 1
  fi
  
  REVALIDATE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  echo "✓ Generated new secret (64 characters)"
fi

echo ""
echo "=========================================="
echo "Adding REVALIDATE_SECRET to Vercel"
echo "=========================================="
echo ""

# Step 6: Add environment variable to all environments (idempotent)
for ENV in production preview development; do
  echo "→ Setting REVALIDATE_SECRET for: $ENV"
  
  # Remove existing value (ignore errors if it doesn't exist)
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY-RUN] vercel env rm REVALIDATE_SECRET $ENV --yes || true"
    echo "  [DRY-RUN] printf %s \"\$REVALIDATE_SECRET\" | vercel env add REVALIDATE_SECRET $ENV"
  else
    vercel env rm REVALIDATE_SECRET "$ENV" --yes 2>/dev/null || true
    
    # Add new value non-interactively
    if printf %s "$REVALIDATE_SECRET" | vercel env add REVALIDATE_SECRET "$ENV" > /dev/null 2>&1; then
      echo "  ✓ Added to $ENV"
    else
      echo "  ❌ Failed to add REVALIDATE_SECRET to $ENV"
      echo "     This might mean it already exists and wasn't removed properly."
      echo "     Try manually: vercel env rm REVALIDATE_SECRET $ENV --yes"
      exit 1
    fi
  fi
done

echo ""

# Step 7: Deploy production
if [ "$SKIP_DEPLOY" = true ]; then
  echo "=========================================="
  echo "Skipping Production Deployment"
  echo "=========================================="
  echo ""
  echo "⚠️  Environment variables are set but deployment was skipped."
  echo "   Run manually: vercel --prod"
  echo ""
else
  echo "=========================================="
  echo "Redeploying Production"
  echo "=========================================="
  echo ""
  
  echo "→ Triggering production deployment..."
  
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] vercel --prod"
  else
    # Try with --yes flag first, fall back to without if it fails
    if ! vercel --prod --yes 2>/dev/null; then
      echo "  (--yes flag not supported, retrying without it)"
      vercel --prod
    fi
  fi
  
  echo ""
  echo "✓ Production deployment triggered"
  echo ""
fi

# Step 8: Verification
if [ "$SKIP_TEST" = true ]; then
  echo "=========================================="
  echo "Skipping Endpoint Test"
  echo "=========================================="
  echo ""
else
  echo "=========================================="
  echo "Verification Test"
  echo "=========================================="
  echo ""
  echo "Testing endpoint: https://www.skynet-consulting.net/api/revalidate"
  echo ""
  
  if [ "$SKIP_DEPLOY" = false ]; then
    echo "Waiting 5 seconds for deployment to propagate..."
    sleep 5
  fi
  
  # Test the endpoint
  if [ "$DRY_RUN" = true ]; then
    echo "[DRY-RUN] curl -sS -i -X POST \"https://www.skynet-consulting.net/api/revalidate\" \\"
    echo "  -H \"Authorization: Bearer \$REVALIDATE_SECRET\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{\"slug\":\"hello-world\"}'"
  else
    echo "→ Sending test request..."
    
    HTTP_RESPONSE=$(curl -sS -i -X POST "https://www.skynet-consulting.net/api/revalidate" \
      -H "Authorization: Bearer $REVALIDATE_SECRET" \
      -H "Content-Type: application/json" \
      -d '{"slug":"hello-world"}' 2>&1 || echo "CURL_FAILED")
    
    if [[ "$HTTP_RESPONSE" == "CURL_FAILED" ]]; then
      echo "❌ curl command failed"
      echo "   Check your network connection and try again"
    else
      # Extract status line
      STATUS_LINE=$(echo "$HTTP_RESPONSE" | head -n 1)
      # Extract JSON body (everything after empty line)
      RESPONSE_BODY=$(echo "$HTTP_RESPONSE" | sed -n '/^$/,$ p' | tail -n +2)
      
      echo ""
      echo "Status: $STATUS_LINE"
      echo ""
      echo "Response:"
      echo "$RESPONSE_BODY"
      echo ""
      
      if echo "$STATUS_LINE" | grep -q "200"; then
        echo "✅ SUCCESS: Endpoint is working correctly"
      else
        echo "⚠️  WARNING: Unexpected status"
        echo "   Expected: HTTP/2 200"
        echo "   This might resolve after DNS/CDN propagation"
      fi
    fi
  fi
  
  echo ""
fi

# Final summary
echo "=========================================="
echo "Setup Complete"
echo "=========================================="
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN completed - no changes were made"
  echo ""
fi

if [ "$PRINT_SECRET" = true ]; then
  echo "📝 REVALIDATE_SECRET (store securely):"
  echo ""
  echo "$REVALIDATE_SECRET"
  echo ""
  echo "⚠️  Add to your local .env.local:"
  echo "echo 'REVALIDATE_SECRET=$REVALIDATE_SECRET' >> .env.local"
else
  echo "🔒 Secret configured on Vercel (not printed for security)"
  echo "   Use --print-secret flag if you need to see it"
fi

echo ""
echo "🎉 The revalidation endpoint is now configured on Vercel!"
echo ""

if [ "$SKIP_DEPLOY" = true ]; then
  echo "⚠️  Remember to deploy: vercel --prod"
fi
