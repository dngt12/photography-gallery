const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  userAgent: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update the updatedAt field before saving
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for finding active sessions by userId
sessionSchema.index({ userId: 1, isActive: 1 });

// Create index for cleanup of expired sessions
sessionSchema.index({ expiresAt: 1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
