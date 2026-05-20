const express = require("express");

const crypto = require("crypto");
const Order = require("../models/Orders");
const router = express.Router();
const User = require("../models/User");
const sendEmail = require("../Utils/SendEmail");




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

    if (expectedSignature !== signature) {
      console.log("❌ Signature mismatch");
      return res.status(400).json({ success: false });
    }

    const body = JSON.parse(rawBody.toString());

    console.log("Event:", body.event);

    // =======================
    // PAYMENT SUCCESS
    // =======================
    if (body.event === "payment.captured") {

  const payment = body.payload.payment.entity;

  const order = await Order.findOne({
    razorpayOrderId: payment.order_id
  });

  if (!order) {
    console.log("Order not found");
    return res.json({ success: true });
  }

  // Prevent duplicate processing
  if (order.paymentProcessed) {
    console.log("Already processed");
    return res.json({ success: true });
  }

  // =========================
  // UPDATE ORDER
  // =========================

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.razorpayPaymentId = payment.id;
  order.paymentProcessed = true;

  await order.save();

  console.log("ORDER UPDATED ✅");

  // =========================
  // SEND EMAILS HERE ✅
  // =========================

  try {

  const user = await User.findById(order.userId);

  // =========================
  // ITEMS HTML
  // =========================

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;">
        ${item.name}
      </td>

      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
        ${item.quantity}
      </td>

      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
        ₹${item.price}
      </td>

      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join("");

  // =========================
  // CUSTOMER EMAIL
  // =========================

  const customerEmail = `
  <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">

    <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

      <div style="background:#111;color:#fff;padding:25px;text-align:center;">

        <h1 style="margin:0;">Karmaas 🌿</h1>

        <p style="margin-top:10px;font-size:16px;">
          Payment Successful ✅
        </p>

      </div>

      <div style="padding:30px;">

        <h2 style="margin-top:0;">
          Hi ${user.name},
        </h2>

        <p>
          Your order has been confirmed successfully 🎉
        </p>

        <div style="background:#f8f8f8;padding:20px;border-radius:10px;margin:20px 0;">

          <p><strong>Order ID:</strong> ${order._id}</p>

          <p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>

          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

        </div>

        <h3>Order Summary</h3>

        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:15px;">

          <thead>

            <tr style="background:#fafafa;">

              <th align="left" style="padding:10px;">Item</th>

              <th align="center" style="padding:10px;">Qty</th>

              <th align="right" style="padding:10px;">Price</th>

              <th align="right" style="padding:10px;">Total</th>

            </tr>

          </thead>

          <tbody>

            ${itemsHtml}

          </tbody>

        </table>

        <div style="margin-top:25px;background:#fafafa;padding:20px;border-radius:10px;">

          <p>
            <strong>Subtotal:</strong>
            ₹${order.subtotal}
          </p>

          <p style="color:green;">
            <strong>Discount:</strong>
            - ₹${order.discount || 0}
          </p>

          <p style="font-size:20px;font-weight:bold;">
            Amount Paid: ₹${order.totalAmount}
          </p>

        </div>

        <div style="margin-top:25px;">

          <h3>Delivery Address</h3>

          <p>
            ${order.address.name}<br/>
            ${order.address.houseNo},
            ${order.address.addressLine}<br/>
            ${order.address.city},
            ${order.address.state}
            - ${order.address.pincode}<br/>
            📞 ${order.address.phone}
          </p>

        </div>

        <div style="text-align:center;margin-top:35px;">

          <a href="https://karmaass.com/orders"
            style="
              background:#111;
              color:#fff;
              text-decoration:none;
              padding:14px 24px;
              border-radius:8px;
              display:inline-block;
            ">
            View Order
          </a>

        </div>

      </div>

      <div style="background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;">

        © 2026 Karmaas. All rights reserved.

      </div>

    </div>

  </div>
  `;

  // =========================
  // ADMIN EMAIL
  // =========================

  const adminEmail = `
  <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">

    <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

      <div style="background:#1a237e;color:#fff;padding:25px;text-align:center;">

        <h1 style="margin:0;">
          New Paid Order 🛍️
        </h1>

      </div>

      <div style="padding:30px;">

        <h2>Customer Details</h2>

        <p><strong>Name:</strong> ${user.name}</p>

        <p><strong>Email:</strong> ${user.email}</p>

        <p><strong>Order ID:</strong> ${order._id}</p>

        <p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>

        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

        <hr style="margin:25px 0;" />

        <h2>Items Ordered</h2>

        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">

          <thead>

            <tr style="background:#fafafa;">

              <th align="left" style="padding:10px;">Item</th>

              <th align="center" style="padding:10px;">Qty</th>

              <th align="right" style="padding:10px;">Price</th>

              <th align="right" style="padding:10px;">Total</th>

            </tr>

          </thead>

          <tbody>

            ${itemsHtml}

          </tbody>

        </table>

        <div style="margin-top:25px;background:#fafafa;padding:20px;border-radius:10px;">

          <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>

          <p style="color:green;">
            <strong>Discount:</strong>
            - ₹${order.discount || 0}
          </p>

          <p style="font-size:20px;font-weight:bold;">
            Amount Paid: ₹${order.totalAmount}
          </p>

        </div>

      </div>

    </div>

  </div>
  `;

  // =========================
  // SEND EMAILS
  // =========================

  await Promise.allSettled([

    sendEmail(
      user.email,
      "Order Confirmed 🛍️ | Karmaas",
      customerEmail
    ),

    sendEmail(
      process.env.BREVO_SENDER_EMAIL,
      `New Paid Order #${order._id}`,
      adminEmail
    )

  ]);

  console.log("📧 Emails Sent");

} catch (emailErr) {

  console.log("EMAIL ERROR ❌");
  console.log(emailErr.message);

}
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
