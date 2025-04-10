const jwt = require('jsonwebtoken');
const { Staff } = require('../models')

// AuthN middleware

const authenticate = async (req, res, next) => {
  try {
    // get token from header
    const token = req.header('Authorize')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find staff member
    const staff = await Staff.findByPk(decoded.id);

    if (!staff) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    // add staff to req object
    req.staff = staff;
    next();
  }
  catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message })
  }
}

module.exports = { authenticate };