const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the Next.js build
console.log('Running Next.js build...');
execSync('next build', { stdio: 'inherit' });

// Check if .next/routes-manifest.json exists
const routesManifestPath = path.join(__dirname, '.next', 'routes-manifest.json');
const publicRoutesManifestPath = path.join(__dirname, 'public', 'routes-manifest.json');

if (fs.existsSync(routesManifestPath)) {
  console.log('Copying routes-manifest.json to public directory...');
  fs.copyFileSync(routesManifestPath, publicRoutesManifestPath);
} else {
  console.log('Creating a default routes-manifest.json...');
  const defaultRoutesManifest = {
    version: 3,
    basePath: "",
    headers: [],
    rewrites: [
      {
        source: "/",
        destination: "/index.html"
      },
      {
        source: "/:path*",
        destination: "/index.html"
      }
    ],
    redirects: [],
    catchAllRouting: true
  };
  
  fs.writeFileSync(
    publicRoutesManifestPath, 
    JSON.stringify(defaultRoutesManifest, null, 2)
  );
}

// Copy index.html to the root of the output directory if it exists
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  console.log('Ensuring index.html is in the root of the output directory...');
  // No need to copy, as public is already the output directory
}

console.log('Build completed successfully!');
