const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import routes - make sure files exist
try {
  const donorRoutes = require('./donors');
  app.use('/api/donors', donorRoutes);
  console.log('✅ Donors route loaded');
} catch (err) {
  console.error('❌ Failed to load donors route:', err.message);
  app.use('/api/donors', (req, res) => {
    res.status(500).json({ error: 'Donors route not configured', details: err.message });
  });
}

try {
  const requestRoutes = require('./requests');
  app.use('/api/requests', requestRoutes);
  console.log('✅ Requests route loaded');
} catch (err) {
  console.error('❌ Failed to load requests route:', err.message);
  app.use('/api/requests', (req, res) => {
    res.status(500).json({ error: 'Requests route not configured', details: err.message });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Route ${req.method} ${req.url} not found` 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
