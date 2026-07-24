const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  message: { type: String, required: true },
  photo: { type: String, default: null },
  status: { type: String, default: 'pending' },
}, {
  timestamps: true,
});

const complaintSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: '',
  },
  categoryName: {
    type: String,
    default: '',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  department: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'Medium', 'High', 'Urgent', 'Critical'],
    default: 'Normal',
  },
  predictions: {
    type: Array,
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending',
  },
  language: {
    type: String,
    default: 'en-IN',
  },
  icon: {
    type: String,
    default: '📋',
  },
  location: {
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
  },
  beforeImage: {
    type: String,
    default: null,
  },
  afterImage: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  sentiment: {
    type: Object,
    default: null,
  },
  verifiedByCitizen: {
    type: Boolean,
    default: false,
  },
  disputedByCitizen: {
    type: Boolean,
    default: false,
  },
  updates: [updateSchema],
}, {
  timestamps: true,
});

// Virtual 'id' field that maps _id to a complaint-style ID
complaintSchema.virtual('complaintId').get(function() {
  return `CMP-${this._id}`;
});

complaintSchema.set('toJSON', { virtuals: true });
complaintSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Complaint', complaintSchema);
