const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DepartmentEmployee = require('../models/DepartmentEmployee');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if user already exists in either collection
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const existingEmployee = await DepartmentEmployee.findOne({ email: email.toLowerCase() });
    
    if (existingUser || existingEmployee) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    let user;
    if (role === 'department') {
      user = new DepartmentEmployee({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
      });
    } else {
      user = new User({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
        role: role || 'citizen',
      });
    }

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user based on role
    let user;
    if (role === 'department') {
      user = await DepartmentEmployee.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me — Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/auth/profile — Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'avatar', 'bio',
      'fatherName', 'motherName', 'dob', 'identityNumber',
      'alternatePhone', 'gender', 'stateResident', 'district',
      'city', 'pincode', 'alternateEmail',
      'departmentName', 'employeeId', 'assignedState',
      'assignedDistrict', 'assignedCity'
    ];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    let user;
    if (req.user.role === 'department') {
      user = await DepartmentEmployee.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/karma — Add karma points
router.post('/karma', auth, async (req, res) => {
  try {
    const { points } = req.body;
    const user = req.user;

    user.karmaPoints = (user.karmaPoints || 0) + (points || 0);

    // Auto-assign badges
    if (user.karmaPoints >= 50 && !user.badges.includes('Civic Starter')) {
      user.badges.push('Civic Starter');
    }
    if (user.karmaPoints >= 150 && !user.badges.includes('Active Citizen')) {
      user.badges.push('Active Citizen');
    }
    if (user.karmaPoints >= 500 && !user.badges.includes('City Guardian')) {
      user.badges.push('City Guardian');
    }

    await user.save();

    res.json({ success: true, karmaPoints: user.karmaPoints, badges: user.badges });
  } catch (err) {
    console.error('Karma error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
