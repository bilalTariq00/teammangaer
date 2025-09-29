import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  publicUrl: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  worker: {
    type: String,
    required: true,
    trim: true
  },
  workerEmail: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'US'
  },
  ip: {
    type: String,
    default: 'Yes'
  },
  min: {
    type: String,
    default: '—'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  allowed: {
    type: Number,
    default: 0
  },
  blocked: {
    type: Number,
    default: 0
  },
  reuseOption: {
    type: String,
    enum: ['unlimited', '1day', '7days', '14days', '30days', 'never'],
    default: 'unlimited'
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
LinkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Link || mongoose.model('Link', LinkSchema);
