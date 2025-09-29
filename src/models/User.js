import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'manager', 'qc', 'hr', 'user'],
    default: 'user'
  },
  // For users with role 'user', specify their task capabilities
  taskRole: {
    type: String,
    enum: ['viewer', 'clicker', 'both'],
    default: 'viewer'
  },
  workerType: {
    type: String,
    enum: ['permanent', 'trainee', 'manager', 'qc', 'hr'],
    default: 'permanent'
  },
  status: {
    type: String,
    enum: ['permanent', 'trainee', 'terminated'],
    default: 'permanent'
  },
  locked: {
    type: String,
    enum: ['locked', 'unlocked'],
    default: 'unlocked'
  },
  links: {
    type: Number,
    default: 0
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Contact information
  contactNumber: {
    type: String,
    default: ''
  },
  emergencyNumber: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  emergencyPhone: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: String,
    default: ''
  },
  socialSecurityNumber: {
    type: String,
    default: ''
  },
  bankAccount: {
    type: String,
    default: ''
  },
  benefits: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: ''
  },
  salary: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: String,
    default: ''
  },
  performance: {
    type: Number,
    default: 0
  },
  attendance: {
    type: Number,
    default: 0
  },
  lastReview: {
    type: String,
    default: ''
  },
  vacationDay: {
    type: String,
    default: 'Monday'
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
