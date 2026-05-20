const express = require("express");

const crypto = require("crypto");
const Order = require("../models/Orders");
const router = express.Router();




const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);


// =========================
// WEBHOOK
// =========================
router.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook Hit ✅");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    // IMPORTANT: use RAW BODY
    const rawBody = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // if (expectedSignature !== signature) {
    //   console.log("❌ Signature mismatch");
    //   return res.status(400).json({ success: false });
    // }

    const body = JSON.parse(rawBody.toString());

    console.log("Event:", body.event);

    // =======================
    // PAYMENT SUCCESS
    // =======================
    if (body.event === "payment.captured") {
      const payment = body.payload.payment.entity;

      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          razorpayPaymentId: payment.id,
        },
        { new: true }
      );

      console.log("ORDER UPDATED ✅", updatedOrder);
    }

    // =======================
    // PAYMENT FAILED
    // =======================
    if (body.event === "payment.failed") {
      const payment = body.payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          paymentStatus: "failed",
          orderStatus: "failed",
        }
      );

      console.log("PAYMENT FAILED ❌");
    }

    res.json({ success: true });
  } catch (err) {
    console.log("WEBHOOK ERROR ❌", err.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
