const express = require("express");
const router = express.Router();




const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

// ===============================
// RAZORPAY WEBHOOK
// ===============================
router.post("/webhook/razorpay-webhook", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const crypto = require("crypto");

    const shasum = crypto.createHmac("sha256", secret);

    shasum.update(req.body); // RAW buffer

    const digest = shasum.digest("hex");

    const signature = req.headers["x-razorpay-signature"];

    if (digest !== signature) {
      return res.status(400).json({ success: false });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          razorpayPaymentId: payment.id
        }
      );
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          paymentStatus: "failed",
          orderStatus: "cancelled"
        }
      );
    }

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;