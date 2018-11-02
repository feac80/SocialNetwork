const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true); // avoid DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
//create user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// createdAt{ timestamps: true }

module.exports = mongoose.model('users', UserSchema);
