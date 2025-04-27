const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run Next.js build
console.log('Running Next.js build...');
execSync('next build', { stdio: 'inherit' });

// Create routes-manifest.json if it doesn't exist
const routesManifestPath = path.join(__dirname, 'public', 'routes-manifest.json');
if (!fs.existsSync(routesManifestPath)) {
  console.log('Creating routes-manifest.json...');
  const routesManifest = {
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
  
  fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2));
}

// Copy .next/static to public/static if it exists
const nextStaticDir = path.join(__dirname, '.next', 'static');
const publicStaticDir = path.join(__dirname, 'public', 'static');

if (fs.existsSync(nextStaticDir)) {
  console.log('Copying .next/static to public/static...');
  
  // Create public/static directory if it doesn't exist
  if (!fs.existsSync(publicStaticDir)) {
    fs.mkdirSync(publicStaticDir, { recursive: true });
  }
  
  // Copy files recursively
  copyFolderRecursiveSync(nextStaticDir, path.join(__dirname, 'public'));
}

// Copy .next/server/pages/api to public/api if it exists
const nextApiDir = path.join(__dirname, '.next', 'server', 'pages', 'api');
const publicApiDir = path.join(__dirname, 'public', 'api');

if (fs.existsSync(nextApiDir)) {
  console.log('Copying API routes...');
  
  // Create public/api directory if it doesn't exist
  if (!fs.existsSync(publicApiDir)) {
    fs.mkdirSync(publicApiDir, { recursive: true });
  }
  
  // Copy files recursively
  copyFolderRecursiveSync(nextApiDir, path.join(__dirname, 'public'));
}

console.log('Build completed successfully!');

// Helper function to copy folders recursively
function copyFolderRecursiveSync(source, target) {
  const targetFolder = path.join(target, path.basename(source));
  
  // Create target folder if it doesn't exist
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }
  
  // Copy files
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function(file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}
