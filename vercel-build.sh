#!/bin/bash

# Run the Next.js build
npm run build

# Ensure the public directory exists
mkdir -p public

# Create routes-manifest.json if it doesn't exist
if [ ! -f "public/routes-manifest.json" ]; then
  echo '{"version":3,"basePath":"","headers":[],"rewrites":[{"source":"/","destination":"/index.html"},{"source":"/:path*","destination":"/index.html"}],"redirects":[],"catchAllRouting":true}' > public/routes-manifest.json
fi

# Copy .next/static to public/static if it exists
if [ -d ".next/static" ]; then
  mkdir -p public/static
  cp -r .next/static/* public/static/
fi

# Copy API routes if they exist
if [ -d ".next/server/pages/api" ]; then
  mkdir -p public/api
  cp -r .next/server/pages/api/* public/api/
fi

echo "Build completed successfully!"
