const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// Register donor
router.post('/', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json({ 
      success: true, 
      message: 'Donor registered successfully!',
      donor 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get donors with filters
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;
    let filter = { isAvailable: true };
    
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = { $regex: city, $options: 'i' };
    
    const donors = await Donor.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
