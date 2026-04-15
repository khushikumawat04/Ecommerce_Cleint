const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  houseNo: String,
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    sparse: true
  },

  password: String,

  googleId: String,

  avatar: String,

  // 🔥 ADD THIS
  addresses: [addressSchema],
    role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);