const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const { StoreSettings } = require('../models');

// Get store settings
router.get('/', authenticate, async (req, res) => {
  try {
    // Get the first settings record or create a default one if none exists
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        lastUpdatedBy: req.user.id
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store settings', error: error.message });
  }
});

// Update store settings - only available to owners
router.put('/', authenticate, checkRole(['owner']), async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await StoreSettings.findOne();
    
    if (!settings) {
      // If no settings exist, create a new one
      settings = await StoreSettings.create({
        ...req.body,
        lastUpdatedBy: userId
      });
    } else {
      // Update existing settings
      await settings.update({
        ...req.body,
        lastUpdatedBy: userId
      });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating store settings', error: error.message });
  }
});

module.exports = router; 