const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  student_no: {
    type: String,
    required: false,
  },
  faculty: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'advisor', 'head', 'admin'],
    default: 'student',
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);