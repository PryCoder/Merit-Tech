const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
      maxlength: 120,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    resumeUrl: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    githubUrl: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    portfolioUrl: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    role: {
      type: String,
      required: true,
      enum: ['candidate', 'company', 'recruiter', 'admin'],
      default: 'candidate',
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = { User };
