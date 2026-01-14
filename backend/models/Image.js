const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an image title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['landscape', 'portrait', 'wildlife', 'architecture', 'macro', 'other'],
      default: 'other'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      trim: true
    },
    cameraSettings: {
      camera: String,
      lens: String,
      aperture: String,
      shutterSpeed: String,
      iso: Number,
      focalLength: String
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for faster queries
imageSchema.index({ photographer: 1, createdAt: -1 });
imageSchema.index({ category: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ featured: 1, isPublished: 1 });

// Virtual for image dimensions (can be populated separately if needed)
imageSchema.virtual('imageStats').get(function () {
  return {
    likes: this.likes,
    views: this.views,
    commentsCount: this.comments.length
  };
});

module.exports = mongoose.model('Image', imageSchema);
