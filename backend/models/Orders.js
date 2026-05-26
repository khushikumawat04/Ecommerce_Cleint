// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
  
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   items: [
//     {
//       name: String,
//       price: Number,
//       quantity: Number,
//       productId: String,
//       image: String
//     }
//   ],

//   totalAmount: {
//     type: Number,
//     required: true
//   },
// couponCode:String,
// discount:Number,
// subtotal:Number,
//   address: {
//     name: String,
//     phone: String,
//     houseNo: String,
//     addressLine: String,
//     landmark: String,
//     city: String,
//     state: String,
//     pincode: String
//   },

//   // 🔥 PAYMENT INFO
//   paymentMethod: {
//     type: String,
//     enum: ["COD", "ONLINE"],
//     required: true
//   },

//   paymentStatus: {
//     type: String,
//     enum: ["pending", "paid", "failed"],
//     default: "pending"
//   },

//   // 🔥 ORDER STATUS (FOR TRACKING)
//   orderStatus: {
//     type: String,
//     enum: ["pending", "confirmed","processing", "shipped", "delivered", "cancelled"],
//     default: "pending"
//   },

//   // 🔥 RAZORPAY FIELDS
//  razorpayOrderId:{
// type:String,
// default:null
// },

//  razorpayPaymentId:{
// type:String,
// default:null
// },
//   razorpaySignature: String,
  
// paymentProcessed: {
//   type: Boolean,
//   default: false
// },
 

//   // 🔥 OPTIONAL: DELIVERY TRACKING
// trackingId: String,
// awbCode: String,
// trackingUrl: String,
// courier: String,
// shipmentId: String,
//   cancelReason: {
//   type: String,
//   default: ""
// },
// cancelledAt: Date,
// deliveredAt: Date,



// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },

        image: String,

        // ✔ IMPORTANT for Shiprocket
        sku: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    couponCode: String,
    discount: Number,
    subtotal: Number,

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

orderStatus: {
  type: String,
  enum: [
    "pending",
    "confirmed",
    "ready_to_ship",
    "shipped",
    "delivered",
    "cancelled",
    "returned" // optional
  ],
  default: "pending"
},

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    paymentProcessed: {
      type: Boolean,
      default: false
    },

    // 🚀 Shiprocket tracking
    trackingId: String,
    awbCode: { type: String, index: true },
    trackingUrl: String,
    courier: String,
    shipmentId: String,
shiprocketOrderId: String,
    shiprocketStatus: {
      type: String,
      enum: ["not_created", "created", "awb_assigned", "shipped", "delivered", "failed"],
      default: "not_created"
    },

    cancelReason: {
      type: String,
      default: ""
    },

    cancelledAt: Date,
    deliveredAt: Date,
    lastWebhookUpdate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);