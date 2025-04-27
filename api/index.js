// This file is used by Vercel to create a serverless function
// that serves the static files in the public directory

const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  // Serve index.html for the root path
  const filePath = path.join(__dirname, '../public', 'index.html');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(content);
  } catch (error) {
    res.status(500).send('Error loading the page');
  }
};
