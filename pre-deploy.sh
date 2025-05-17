#!/bin/bash

echo "Preparing for Vercel deployment..."

# Make sure API directory has its own package.json
if [ -f "api/package.json" ]; then
  echo "✅ API package.json already exists"
else
  echo "Creating API package.json..."
  cat > api/package.json << 'EOF'
{
  "name": "kailani-api",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "dotenv": "^16.5.0",
    "nodemailer": "^7.0.3"
  },
  "engines": {
    "node": ">=18.x"
  }
}
EOF
fi

# Check if the JavaScript version of the API exists
if [ -f "api/send-email.js" ]; then
  echo "✅ ES Module version of API file exists"
else
  echo "❌ Error: api/send-email.js is missing!"
  echo "Please create this file to ensure compatibility with Vercel."
  exit 1
fi

# Verify vercel.json is properly configured
if grep -q "send-email.js" vercel.json; then
  echo "✅ Vercel config is correctly pointing to the JS file"
else
  echo "❌ Warning: vercel.json might not be properly configured!"
  echo "Make sure it points to 'send-email.js' instead of 'send-email.ts'"
fi

echo "Checking environment variables:"
if [ -f .env ]; then
  if grep -q "EMAIL_USER" .env && grep -q "EMAIL_PASS" .env; then
    echo "✅ Local .env file contains email configuration"
  else
    echo "⚠️ Warning: .env file may be missing email configuration!"
  fi
else
  echo "⚠️ No local .env file found!"
fi

echo "Remember to set these environment variables in Vercel:"
echo "- EMAILUSER"
echo "- EMAILPASS"
echo "- EMAILRECIPIENT (optional)"

echo "Deployment preparation complete!"
