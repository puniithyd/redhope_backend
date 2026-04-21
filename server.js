const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// ✅ CORS MUST BE AT THE TOP - BEFORE ANY ROUTES
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// ============ DONORS ENDPOINTS ============

// GET all donors
app.get('/api/donors', (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    
    let donors = [
      {
        id: 1,
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        bloodGroup: 'O+',
        age: 28,
        city: 'Mumbai',
        isAvailable: true
      },
      {
        id: 2,
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '9876543211',
        bloodGroup: 'A+',
        age: 25,
        city: 'Delhi',
        isAvailable: true
      },
      {
        id: 3,
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '9876543212',
        bloodGroup: 'B+',
        age: 30,
        city: 'Mumbai',
        isAvailable: true
      }
    ];
    
    if (bloodGroup) {
      donors = donors.filter(d => d.bloodGroup === bloodGroup);
    }
    if (city) {
      donors = donors.filter(d => d.city.toLowerCase() === city.toLowerCase());
    }
    
    res.json({
      success: true,
      count: donors.length,
      donors: donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST register new donor
app.post('/api/donors', (req, res) => {
  try {
    const donorData = req.body;
    
    const requiredFields = ['name', 'email', 'phone', 'bloodGroup', 'age', 'city'];
    for (const field of requiredFields) {
      if (!donorData[field]) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`
        });
      }
    }
    
    const newDonor = {
      id: Date.now(),
      ...donorData,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Donor registered successfully!',
      donor: newDonor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ BLOOD REQUEST ENDPOINTS ============

// GET all blood requests
app.get('/api/requests', (req, res) => {
  try {
    const { city, urgency } = req.query;
    
    let requests = [
      {
        id: 1,
        patientName: 'Rajesh Kumar',
        bloodGroup: 'O+',
        quantity: '2 units',
        hospital: 'City Hospital',
        city: 'Mumbai',
        contactPerson: 'Suresh',
        contactPhone: '9988776655',
        urgency: 'Emergency',
        status: 'Pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        patientName: 'Sunita Verma',
        bloodGroup: 'A-',
        quantity: '1 unit',
        hospital: 'Apollo Hospital',
        city: 'Delhi',
        contactPerson: 'Vikram',
        contactPhone: '9876543210',
        urgency: 'Urgent',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ];
    
    if (city) {
      requests = requests.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }
    if (urgency) {
      requests = requests.filter(r => r.urgency === urgency);
    }
    
    res.json({
      success: true,
      count: requests.length,
      requests: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST create blood request
app.post('/api/requests', (req, res) => {
  try {
    const requestData = req.body;
    
    const requiredFields = ['patientName', 'bloodGroup', 'quantity', 'hospital', 'city', 'contactPerson', 'contactPhone'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`
        });
      }
    }
    
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Blood request created successfully!',
      request: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Route ${req.method} ${req.url} not found` 
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
