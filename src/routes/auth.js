const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Staff, sequelize } = require('../models');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Login attempt for user: ${username}`);

    // Check database connection
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.error('Database not accessible during login:', err);
      return res.status(500).json({ 
        message: 'Database connection error', 
        error: 'Could not connect to the database' 
      });
    }

    // Check if users exist at all
    const staffCount = await Staff.count();
    if (staffCount === 0) {
      console.error('No users in the database - initial data may not have been created');
      return res.status(500).json({ 
        message: 'Authentication system is not initialized properly',
        error: 'No users exist in the database'
      });
    }

    // find staff by username
    const staff = await Staff.findOne({ where: { username } });
    if (!staff) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: staff.id, role: staff.role },
      process.env.JWT_SECRET || '1a4ecab4992e0a9f9f34c171906a614efe30c1916c55edc818d9a534a61141c7',
      { expiresIn: '1h' }
    );

    console.log(`Login successful for user: ${username} (${staff.role})`);
    
    res.json({
      message: 'Login successful',
      token,
      staff: {
        id: staff.id,
        username: staff.username,
        role: staff.role,
        storeLocation: staff.storeLocation
      }
    });
  }
  catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

module.exports = router;