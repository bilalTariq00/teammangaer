import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'marked', 'approved', 'rejected'],
    default: 'marked'
  },
  checkIn: {
    type: String, // HH:MM format
    required: true
  },
  checkOut: {
    type: String, // HH:MM format
    default: null
  },
  totalHours: {
    type: Number, // Total hours worked in the day
    default: 0
  },
  sessions: [{
    sessionId: String,
    checkIn: String, // HH:MM format
    checkOut: String, // HH:MM format
    hours: Number, // Hours for this session
    notes: String
  }],
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
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to calculate total hours from sessions
attendanceSchema.methods.calculateTotalHours = function() {
  let total = 0;
  this.sessions.forEach(session => {
    if (session.hours) {
      total += session.hours;
    }
  });
  this.totalHours = Math.round(total * 10) / 10; // Round to 1 decimal place
  return this.totalHours;
};

// Method to add a new session
attendanceSchema.methods.addSession = function(checkIn, checkOut, notes = '') {
  const sessionId = new Date().getTime().toString();
  
  // Calculate hours for this session
  let hours = 0;
  if (checkIn && checkOut) {
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    hours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    if (hours < 0) hours += 24; // Handle overnight shifts
    hours = Math.round(hours * 10) / 10;
  }
  
  const session = {
    sessionId,
    checkIn,
    checkOut,
    hours,
    notes
  };
  
  this.sessions.push(session);
  this.calculateTotalHours();
  
  return session;
};

// Method to update last activity
attendanceSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  this.isOnline = true;
};

// Method to mark as offline if inactive for more than 30 minutes
attendanceSchema.methods.checkOfflineStatus = function() {
  const now = new Date();
  const timeDiff = now - this.lastActivity;
  const minutesDiff = timeDiff / (1000 * 60);
  
  if (minutesDiff > 30) {
    this.isOnline = false;
    // If user was online and now offline, add checkout time
    if (this.sessions.length > 0) {
      const lastSession = this.sessions[this.sessions.length - 1];
      if (lastSession.checkIn && !lastSession.checkOut) {
        const now = new Date();
        const checkOutTime = now.toTimeString().slice(0, 5);
        lastSession.checkOut = checkOutTime;
        this.calculateTotalHours();
      }
    }
  }
  
  return this.isOnline;
};

// Static method to get attendance for a user on a specific date
attendanceSchema.statics.getUserAttendance = async function(userId, date) {
  return await this.findOne({ userId, date });
};

// Static method to get attendance for a team
attendanceSchema.statics.getTeamAttendance = async function(teamUserIds, date) {
  return await this.find({ 
    userId: { $in: teamUserIds }, 
    date 
  }).populate('userId', 'name email role workerType');
};

// Static method to get attendance statistics for a date
attendanceSchema.statics.getAttendanceStats = async function(date) {
  const stats = await this.aggregate([
    { $match: { date } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $in: ['$status', ['present', 'marked', 'approved']] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $in: ['$status', ['absent', 'rejected']] }, 1, 0] } },
        verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
        totalHours: { $sum: '$totalHours' }
      }
    }
  ]);
  
  return stats[0] || { total: 0, present: 0, absent: 0, verified: 0, totalHours: 0 };
};

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

