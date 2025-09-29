import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'draft'],
    default: 'active'
  },
  destinationLink: {
    type: String,
    trim: true
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  sessions: {
    type: Number,
    default: 0
  },
  searches: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  budget: {
    type: Number,
    default: 0
  },
  spent: {
    type: Number,
    default: 0
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  workers: {
    permanentWorkers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    traineeWorkers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
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

// Update the updatedAt field before saving
CampaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
