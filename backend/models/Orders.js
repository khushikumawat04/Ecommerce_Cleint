const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      productId: String,
      image: String
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  address: {
    name: String,
    phone: String,
    houseNo: String,
    addressLine: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String
  },

  // 🔥 PAYMENT INFO
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  // 🔥 ORDER STATUS (FOR TRACKING)
  orderStatus: {
    type: String,
    enum: ["created", "confirmed", "shipped", "delivered", "cancelled"],
    default: "created"
  },

  // 🔥 RAZORPAY FIELDS
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  // 🔥 RETRY SUPPORT
  retryCount: {
    type: Number,
    default: 0
  },

  // 🔥 OPTIONAL: DELIVERY TRACKING
  trackingId: String,
  courier: String,
  shipmentId: String,
  cancelReason: {
  type: String,
  default: ""
},
cancelledAt: Date,
deliveredAt: Date,

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);