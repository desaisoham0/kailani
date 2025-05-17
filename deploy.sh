#!/bin/bash

# Colorful output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== Kailani Website Deployment =====${NC}"

# Remind about environment variables
echo -e "${YELLOW}IMPORTANT: Make sure you've set up these environment variables on Vercel:${NC}"
echo -e "  - EMAILUSER (Gmail address)"
echo -e "  - EMAILPASS (Gmail App Password)"
echo -e "  - EMAILRECIPIENT (Destination email)"
echo ""
read -p "Have you configured these environment variables on Vercel? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Please set up the environment variables before deploying.${NC}"
  echo -e "See ${BLUE}VERCEL_ENV_SETUP.md${NC} for instructions."
  exit 1
fi

echo -e "${GREEN}Building for production...${NC}"
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful! Deploying to Vercel...${NC}"
  npx vercel --prod
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment completed!${NC}"
    echo -e "${YELLOW}If you encounter email issues:${NC}"
    echo -e "1. Check the function logs in your Vercel dashboard"
    echo -e "2. Verify your environment variables are set correctly"
    echo -e "3. Follow the troubleshooting steps in ${BLUE}VERCEL_ENV_SETUP.md${NC}"
  else
    echo -e "${RED}Deployment failed!${NC}"
  fi
else
  echo -e "${RED}Build failed. Please fix the errors before deploying.${NC}"
  exit 1
fi
