const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Private AKS Cluster!',
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js app running on port ${port}`);
  console.log(`Hostname: ${os.hostname()}`);
});
