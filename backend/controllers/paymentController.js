const razorpay = require("../config/razorpay");
const Order = require("../models/Orders");
const crypto = require("crypto");

// ===============================
// CREATE RAZORPAY ORDER
// ===============================
// exports.createOrder = async (req, res) => {
//   try {

//     let { amount } = req.body;

//     amount = Number(amount);

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid amount"
//       });
//     }

//     const options = {
//       amount: Math.round(amount * 100),
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//       payment_capture: 1
//     };

//     const razorpayOrder =
//       await razorpay.orders.create(options);

//     return res.json({
//       success: true,
//       razorpayOrder
//     });

//   } catch (err) {

//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }
// };

exports.createOrder = async(req,res)=>{
try{

const { amount, orderId } = req.body;

const options = {

amount: Math.round(amount * 100),

currency:"INR",

receipt: `receipt_${orderId}`

};

const razorOrder =
await razorpay.orders.create(options);


// SAVE razorpayOrderId
await Order.findByIdAndUpdate(
orderId,
{
razorpayOrderId: razorOrder.id
}
);

res.json({
success:true,
razorOrder
});

}catch(err){

res.status(500).json({
success:false,
message:err.message
});

}
};


// ===============================
// VERIFY PAYMENT (Frontend Verify)
// ===============================
exports.verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // ===============================
    // VERIFY SIGNATURE
    // ===============================
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEYSECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });

    }

    // ===============================
    // FETCH PAYMENT
    // ===============================
    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    // ===============================
    // CHECK PAYMENT STATUS
    // ===============================
    if (payment.status !== "captured") {

      return res.status(400).json({
        success: false,
        message: `Payment status is ${payment.status}`
      });

    }

    // SUCCESS
    return res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

};