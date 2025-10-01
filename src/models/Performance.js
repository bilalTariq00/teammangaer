import mongoose from 'mongoose';

const PerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  // Click performance data
  totalClicks: {
    type: Number,
    default: 0
  },
  goodClicks: {
    type: Number,
    default: 0
  },
  badClicks: {
    type: Number,
    default: 0
  },
  // Performance metrics
  performance: {
    type: Number, // Percentage (0-100)
    default: 0
  },
  performanceStatus: {
    type: String,
    enum: ['excellent', 'good', 'average', 'bad', 'worst'],
    default: 'average'
  },
  dailyTarget: {
    type: Number,
    default: 80 // Default daily target
  },
  targetMet: {
    type: Boolean,
    default: false
  },
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending'
  },
  // Additional data
  notes: {
    type: String,
    default: ''
  },
  markedBy: {
    type: String,
    enum: ['self', 'manager', 'system'],
    default: 'self'
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for userId and date
PerformanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate performance percentage before saving
PerformanceSchema.pre('save', function(next) {
  if (this.totalClicks > 0) {
    this.performance = Math.round((this.goodClicks / this.totalClicks) * 100);
    this.targetMet = this.totalClicks >= this.dailyTarget;
  }
  next();
});

const Performance = mongoose.models.Performance || mongoose.model('Performance', PerformanceSchema);

export default Performance;

