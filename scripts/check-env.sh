#!/bin/bash
# Environment Variables Checker for Vercel Deployment
# Run: bash scripts/check-env.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

check_var() {
  local var_name=$1
  local required=$2
  local description=$3

  if [ -z "${!var_name}" ]; then
    if [ "$required" = "required" ]; then
      echo -e "${RED}MISSING${NC}  $var_name - $description"
      ERRORS=$((ERRORS + 1))
    else
      echo -e "${YELLOW}OPTIONAL${NC} $var_name - $description"
    fi
  else
    echo -e "${GREEN}SET${NC}      $var_name"
  fi
}

echo "====================================="
echo " Environment Variables Check"
echo "====================================="
echo ""

check_var "DATABASE_URL"                       "required" "MongoDB connection string (used in prisma/schema.prisma)"
check_var "AUTH_SECRET"                         "required" "NextAuth v5 secret (required in production)"
check_var "STRIPE_SECRET_KEY"                   "required" "Stripe API key (used in src/lib/stripe.ts)"
check_var "STRIPE_WEBHOOK_SECRET"               "required" "Stripe webhook signing secret (used in src/app/api/stripe/webhook/route.ts)"
check_var "GOOGLE_CLIENT_ID"                    "required" "Google OAuth client ID (used in src/lib/auth.config.ts)"
check_var "GOOGLE_CLIENT_SECRET"                "required" "Google OAuth client secret (used in src/lib/auth.config.ts)"
check_var "NEXT_PUBLIC_BASE_URL"                 "optional" "Public app URL, defaults to http://localhost:3000"
check_var "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"   "optional" "Cloudinary cloud name for image uploads"

echo ""
echo "====================================="
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}$ERRORS required variable(s) missing!${NC}"
  echo "Set them in Vercel: Project Settings > Environment Variables"
  exit 1
else
  echo -e "${GREEN}All required variables are set.${NC}"
  exit 0
fi
