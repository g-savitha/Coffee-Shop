const express = require('express');
const bcrypt = require('bcrypt');
const { Staff } = require('../models');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

const router = express.Router();

// Get all staff members (Owner only)
router.get('/', authenticate, checkRole('manage_staff'), async (req, res) => {
  try {
    const staff = await Staff.findAll({
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    res.json(staff);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

// Get a single staff member
router.get('/:id', authenticate, checkRole('manage_staff'), async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Don't return password
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching staff member', error: error.message });
  }
});

// Create a new staff member (Owner only)
router.post('/', authenticate, checkRole('manage_staff'), async (req, res) => {
  try {
    const { username, password, role, shift, storeLocation, trainingLevel } = req.body;
    
    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }
    
    // Check if username already exists
    const existingStaff = await Staff.findOne({ where: { username } });
    if (existingStaff) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create staff member
    const staff = await Staff.create({
      username,
      password: hashedPassword,
      role,
      shift: shift || 'morning',
      hireDate: new Date(),
      trainingLevel: trainingLevel || 1,
      storeLocation: storeLocation || 'main'
    });
    
    // Return created staff without password
    const { password: _, ...staffWithoutPassword } = staff.toJSON();
    res.status(201).json(staffWithoutPassword);
  }
  catch (error) {
    res.status(500).json({ message: 'Error creating staff member', error: error.message });
  }
});

// Update a staff member (Owner only)
router.put('/:id', authenticate, checkRole('manage_staff'), async (req, res) => {
  try {
    const { username, role, shift, storeLocation, trainingLevel } = req.body;
    
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Update fields
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (shift) updateData.shift = shift;
    if (storeLocation) updateData.storeLocation = storeLocation;
    if (trainingLevel) updateData.trainingLevel = trainingLevel;
    
    await staff.update(updateData);
    
    // Return updated staff without password
    const updatedStaff = await Staff.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedStaff);
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating staff member', error: error.message });
  }
});

// Delete a staff member (Owner only)
router.delete('/:id', authenticate, checkRole('manage_staff'), async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Prevent deleting yourself
    if (staff.id === req.staff.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await staff.destroy();
    res.json({ message: 'Staff member deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error deleting staff member', error: error.message });
  }
});

module.exports = router; 