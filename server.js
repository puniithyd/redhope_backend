const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration - UPDATE THIS with your actual Netlify URL
app.use(cors({
  origin: 'https://your-frontend.netlify.app', // CHANGE THIS to your actual frontend URL
  credentials: true
}));

app.use(express.json());

// MongoDB connection - Using MONGODB_URI (matches Render env variable)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// Donor Schema
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  lastDonated: { type: Date, default: Date.now },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Donor = mongoose.model('Donor', donorSchema);

// API Routes
app.post('/api/donors', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/donors', async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    let query = { isAvailable: true };
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = city;
    
    const donors = await Donor.find(query).limit(50);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Blood Connect API is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/donors`);
});
