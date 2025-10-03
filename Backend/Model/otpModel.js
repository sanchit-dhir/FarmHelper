const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  expireAt: {
    type: Date,
    required: true,
    index: {
      expires: 0,
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Otp', otpSchema);