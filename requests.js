const express = require('express');
const router = express.Router();
const BloodRequest = require('./blood_requests');  // Or whatever your model file is named

// Create blood request
router.post('/', async (req, res) => {
  try {
    const request = new BloodRequest(req.body);
    await request.save();
    res.status(201).json({
      success: true,
      message: 'Blood request created successfully!',
      request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all requests
router.get('/', async (req, res) => {
  try {
    const { city, urgency } = req.query;
    let filter = { status: 'Pending' };
    
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (urgency) filter.urgency = urgency;
    
    const requests = await BloodRequest.find(filter).sort({ 
      urgency: -1,
      createdAt: -1 
    });
    
    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update request status
router.put('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Request updated successfully!',
      request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
