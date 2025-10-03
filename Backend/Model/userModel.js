//importing mongoose
const mongoose = require('mongoose');

//Creating Schema of User
const user = new mongoose.Schema({
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
module.exports = mongoose.model('User', user)