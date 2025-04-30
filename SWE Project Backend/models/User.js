const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  studentNo: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  prefix: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  status: {
    type: String,
    trim: true
  },
  group: {
    type: String,
    trim: true
  }
});

// Pre-save hook to generate name from firstName and lastName if not provided
userSchema.pre('save', function (next) {
  if (!this.name && this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);