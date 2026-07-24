const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const departmentEmployeeSchema = new mongoose.Schema({
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
    default: 'department',
  },
  departmentName: {
    type: String,
    default: '',
  },
  employeeId: {
    type: String,
    default: '',
  },
  assignedState: {
    type: String,
    default: '',
  },
  assignedDistrict: {
    type: String,
    default: '',
  },
  assignedCity: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Hash password before saving
departmentEmployeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
departmentEmployeeSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
departmentEmployeeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('DepartmentEmployee', departmentEmployeeSchema);
