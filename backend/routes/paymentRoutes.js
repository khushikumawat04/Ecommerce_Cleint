const express = require("express");
const router = express.Router();




const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

// ===============================
// RAZORPAY WEBHOOK
// ===============================
router.post("/webhook", async (req, res) => {

try {

const secret =
process.env.RAZORPAY_WEBHOOK_SECRET;

// ======================
// CREATE SIGNATURE
// ======================

const shasum = crypto.createHmac(
"sha256",
secret
);

// IMPORTANT
shasum.update(req.body);

const digest = shasum.digest("hex");

const signature =
req.headers["x-razorpay-signature"];

// ======================
// VERIFY SIGNATURE
// ======================

if (digest !== signature) {

console.log("Webhook signature failed");

return res.status(400).json({
success: false
});

}

const event = JSON.parse(req.body).event;

// ======================
// PAYMENT CAPTURED
// ======================

if (event === "payment.captured") {

const body = JSON.parse(req.body);

const payment =
body.payload.payment.entity;

await Order.findOneAndUpdate(

{
razorpayOrderId:
payment.order_id
},

{
paymentStatus: "paid",
orderStatus: "confirmed",
razorpayPaymentId:
payment.id
}

);

console.log("Order updated successfully");
}

// ======================
// PAYMENT FAILED
// ======================

if (event === "payment.failed") {

const body = JSON.parse(req.body);

const payment =
body.payload.payment.entity;

await Order.findOneAndUpdate(

{
razorpayOrderId:
payment.order_id
},

{
paymentStatus: "failed",
orderStatus: "failed"
}

);

console.log("Payment failed");
}

res.json({
success: true
});

} catch (err) {

console.log("Webhook Error:", err);

res.status(500).json({
success: false
});

}

});

module.exports = router;