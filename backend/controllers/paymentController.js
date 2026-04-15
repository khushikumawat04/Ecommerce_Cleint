const razorpay = require("../config/razorpay");
const Order = require("../models/Orders");
const crypto = require("crypto");


// CREATE RAZORPAY ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + orderId
    };

    const razorOrder = await razorpay.orders.create(options);

    // 🔥 SAVE RAZORPAY ORDER ID IN DB
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorOrder.id
    });

    res.json(razorOrder);

  } catch (err) {
    console.log("RAZORPAY ERROR 👉", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEYSECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        razorpayPaymentId: razorpay_payment_id
      });

      return res.json({ success: true });

    } else {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch"
      });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};