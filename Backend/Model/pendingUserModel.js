//importing mongoose
const mongoose = require('mongoose');

//Creating Schema of User
const pendingUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  }
}, {
  timestamps: true
});

//Exports
module.exports = mongoose.model('PendingUser', pendingUser)