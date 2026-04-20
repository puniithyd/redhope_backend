/ Add this at the top of server.js
require('dotenv').config();

// Change MongoDB connection to:
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Change port to:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🚀"))
  .catch(err => console.log(err));

// Donor Schema
const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  city: String,
  phone: String,
  lastDonated: Date,
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
  const { bloodGroup, city } = req.query;
  let query = { isAvailable: true };
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (city) query.city = city;
  
  const donors = await Donor.find(query).limit(50);
  res.json(donors);
});

app.listen(5000, () => console.log('Server running on port 5000'));
