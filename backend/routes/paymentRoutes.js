const express = require("express");
const router = express.Router();




const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);


// =========================
// WEBHOOK
// =========================

router.post("/webhook", async (req, res) => {

try {

console.log("Webhook Hit");

// =========================
// VERIFY SIGNATURE
// =========================

const secret =
process.env.RAZORPAY_WEBHOOK_SECRET;
console.log("Secret:", secret);

const signature =
req.headers["x-razorpay-signature"];

const expectedSignature = crypto
.createHmac("sha256", secret)
.update(req.body)
.digest("hex");

if (expectedSignature !== signature) {

console.log("Signature Failed");

return res.status(400).json({
success: false
});

}

// =========================
// PARSE BODY
// =========================

const body = JSON.parse(req.body.toString());

console.log(body.event);

// =========================
// PAYMENT CAPTURED
// =========================

if (body.event === "payment.captured") {

const payment =
body.payload.payment.entity;

console.log(payment.order_id);

const updatedOrder =
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
},

{
new: true
}

);

console.log(updatedOrder);

console.log("ORDER UPDATED");
}

// =========================
// PAYMENT FAILED
// =========================

if (body.event === "payment.failed") {

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

console.log("PAYMENT FAILED");
}

res.json({
success: true
});

} catch (err) {

console.log("WEBHOOK ERROR");
console.log(err);

res.status(500).json({
success: false
});

}

});


module.exports = router;