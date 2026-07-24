const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DepartmentEmployee = require('../models/DepartmentEmployee');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.userId);
    if (!user) {
      user = await DepartmentEmployee.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Optional auth — sets req.user if token exists, but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await User.findById(decoded.userId);
      if (!user) {
        user = await DepartmentEmployee.findById(decoded.userId);
      }
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
  } catch {
    // Silently ignore — user just won't be set
  }
  next();
};

module.exports = { auth, optionalAuth };
