const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'RedHope API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Test donors endpoint without database
app.get('/api/donors', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Donors endpoint working (database not connected yet)',
    donors: []
  });
});

app.post('/api/donors', (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Donor registration endpoint working',
    data: req.body
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
