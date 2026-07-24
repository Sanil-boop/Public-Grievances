const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['citizen', 'department', 'admin'],
    default: 'citizen',
  },
  karmaPoints: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  dob: { type: String, default: '' },
  identityNumber: { type: String, default: '' },
  alternatePhone: { type: String, default: '' },
  gender: { type: String, default: '' },
  stateResident: { type: String, default: '' },
  district: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  alternateEmail: { type: String, default: '' },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
