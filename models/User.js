const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['retail', 'b2b_broker', 'warehouse_staff', 'driver', 'admin'],
      default: 'retail'
    },
    companyName: {
      type: String,
      default: null // Used for B2B commercial accounts
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);