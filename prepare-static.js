const fs = require('fs');
const path = require('path');

// Copy vercel-static.json to vercel.json
console.log('Setting up for static deployment...');
fs.copyFileSync(
  path.join(__dirname, 'vercel-static.json'),
  path.join(__dirname, 'vercel.json')
);

console.log('Static deployment configuration complete!');
