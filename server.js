const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/redhope';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });

// Import Routes
let donorRoutes, requestRoutes;
try {
  donorRoutes = require('./donors');
  console.log('donors.js loaded');
} catch (err) {
  console.error('Failed to load donors.js:', err.message);
  donorRoutes = (req, res) => res.status(500).json({ error: 'Donors route not available' });
}

try {
  requestRoutes = require('./requests');
  console.log('requests.js loaded');
} catch (err) {
  console.error('Failed to load requests.js:', err.message);
  requestRoutes = (req, res) => res.status(500).json({ error: 'Requests route not available' });
}

// Use Routes
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'RedHope Blood Connect API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      donors: '/api/donors',
      requests: '/api/requests',
      health: '/health'
    }
  });
});

// Test database endpoint
app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    dbStatus: states[state] || 'unknown',
    mongodbUri: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: err.message || 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route ' + req.method + ' ' + req.url + ' not found' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/health');
});
