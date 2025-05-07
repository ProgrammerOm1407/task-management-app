const express = require('express');
const app = express();

// Simple route
app.get('/', (req, res) => {
  res.send('Simple server is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});