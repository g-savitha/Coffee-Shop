const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const { Inventory } = require('../models');

// Get all inventory items
router.get('/', authenticate, async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll();
    res.json(inventoryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
});

// Get a single inventory item
router.get('/:id', authenticate, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory item', error: error.message });
  }
});

// Create a new inventory item
router.post('/', authenticate, checkRole(['owner', 'store_manager', 'shift_manager']), async (req, res) => {
  try {
    const userId = req.user.id;
    const newItem = await Inventory.create({
      ...req.body,
      lastUpdatedBy: userId
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating inventory item', error: error.message });
  }
});

// Update an inventory item
router.put('/:id', authenticate, checkRole(['owner', 'store_manager', 'shift_manager']), async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await Inventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    await item.update({
      ...req.body,
      lastUpdatedBy: userId
    });
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inventory item', error: error.message });
  }
});

// Delete an inventory item
router.delete('/:id', authenticate, checkRole(['owner', 'store_manager']), async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    await item.destroy();
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inventory item', error: error.message });
  }
});

module.exports = router; 