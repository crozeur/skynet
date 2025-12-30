#!/bin/bash
set -euo pipefail

echo "🚀 Starting test..."
echo ""

# Kill any existing Node processes
echo "Killing existing Node processes..."
pkill -f "node" || true
sleep 2

# Start the production server
echo "Building and starting Next.js..."
npm run build > /dev/null 2>&1
npm run start &
SERVER_PID=$!

echo "Waiting for server to be ready..."
sleep 3

# Test the endpoint
echo ""
echo "Testing POST /api/revalidate"
echo "---"

RESPONSE=$(curl -s -i -X POST "http://localhost:3000/api/revalidate" \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" \
  -d '{"slug":"hello-world"}')

echo "$RESPONSE"
echo ""

# Extract status code
STATUS=$(echo "$RESPONSE" | head -n 1)
echo "---"
echo "Result: $STATUS"
echo ""

# Kill the server
kill $SERVER_PID 2>/dev/null || true

# Check if successful
if echo "$STATUS" | grep -q "200"; then
  echo "✅ SUCCESS! Endpoint is working correctly"
  exit 0
else
  echo "❌ FAILED! Unexpected status"
  exit 1
fi
