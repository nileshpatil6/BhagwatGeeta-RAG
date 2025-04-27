const express = require('express');
const path = require('path');

const server = express();
const publicPath = path.join(__dirname, 'public');

// Serve static files from the public directory
server.use(express.static(publicPath));

// API routes
server.use('/api', (req, res, next) => {
  // Handle API routes here if needed
  // For now, just pass through to the static files
  next();
});

// Serve the index.html file for all other routes
server.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
