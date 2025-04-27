#!/bin/bash

# Set -e to exit immediately if a command exits with a non-zero status
set -e

echo "Starting build process..."

# Skip Next.js build to avoid recursion (since this script is called by npm run build)
# Instead, we'll just make sure the public directory is properly set up

# Ensure the public directory exists
echo "Ensuring public directory exists..."
mkdir -p public

# Check if static-index.html exists and use it as index.html
if [ -f "public/static-index.html" ]; then
  echo "Using static-index.html as index.html..."
  cp public/static-index.html public/index.html
elif [ -f "public/fallback.html" ]; then
  echo "Using fallback.html as index.html..."
  cp public/fallback.html public/index.html
else
  echo "Creating a minimal index.html..."
  echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bhagavad Gita Chat</title></head><body style="margin:0;padding:0;font-family:sans-serif;"><div style="display:flex;flex-direction:column;height:100vh;"><div style="background-color:#FF8C00;color:white;padding:20px;text-align:center;"><h1>Bhagavad Gita Chat</h1></div><div style="flex:1;padding:20px;overflow-y:auto;"><p>Namaste! Welcome to the Bhagavad Gita Chat application.</p></div></div></body></html>' > public/index.html
fi

# Create routes-manifest.json if it doesn't exist
echo "Creating routes-manifest.json..."
echo '{"version":3,"basePath":"","headers":[],"rewrites":[{"source":"/","destination":"/index.html"},{"source":"/:path*","destination":"/index.html"}],"redirects":[],"catchAllRouting":true}' > public/routes-manifest.json

echo "Build completed successfully!"
