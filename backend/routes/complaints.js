const express = require('express');
const Complaint = require('../models/Complaint');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/complaints — Get all complaints (optionally filtered)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, category, userId, limit = 100 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (userId) filter.userId = userId;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    // Map _id to id for frontend compatibility
    const mapped = complaints.map(c => {
      const obj = c.toJSON();
      obj.id = obj._id.toString();
      return obj;
    });

    res.json({ complaints: mapped });
  } catch (err) {
    console.error('Get complaints error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/complaints/my — Get current user's complaints
router.get('/my', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const mapped = complaints.map(c => {
      const obj = c.toJSON();
      obj.id = obj._id.toString();
      return obj;
    });

    res.json({ complaints: mapped });
  } catch (err) {
    console.error('Get my complaints error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/complaints/stats — Get complaint statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    res.json({ total, pending, inProgress, resolved });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/complaints — Create a new complaint
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      text, category, categoryName, confidence, department,
      priority, predictions, language, icon, location,
      beforeImage, sentiment,
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Complaint text is required.' });
    }

    const complaint = new Complaint({
      text,
      category: category || '',
      categoryName: categoryName || '',
      confidence: confidence || 0,
      department: department || '',
      priority: priority || 'Medium',
      predictions: predictions || [],
      status: 'pending',
      language: language || 'en-IN',
      icon: icon || '📋',
      location: location || {},
      beforeImage: beforeImage || null,
      sentiment: sentiment || null,
      userId: req.user ? req.user._id : null,
    });

    await complaint.save();

    const obj = complaint.toJSON();
    obj.id = obj._id.toString();

    res.status(201).json({ success: true, complaint: obj });
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/complaints/:id — Update a complaint
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const allowedUpdates = [
      'text', 'category', 'categoryName', 'status', 'priority',
      'department', 'afterImage', 'verifiedByCitizen', 'disputedByCitizen',
    ];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const obj = complaint.toJSON();
    obj.id = obj._id.toString();

    res.json({ success: true, complaint: obj });
  } catch (err) {
    console.error('Update complaint error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/complaints/:id — Delete a complaint
router.delete('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Complaint deleted.' });
  } catch (err) {
    console.error('Delete complaint error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/complaints/:id/updates — Add an update to a complaint
router.post('/:id/updates', optionalAuth, async (req, res) => {
  try {
    const { message, photo, status } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Update message is required.' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    complaint.updates.push({ message, photo: photo || null, status: status || complaint.status });

    if (status) {
      complaint.status = status;
    }

    await complaint.save();

    const obj = complaint.toJSON();
    obj.id = obj._id.toString();

    res.json({ success: true, complaint: obj });
  } catch (err) {
    console.error('Add update error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
