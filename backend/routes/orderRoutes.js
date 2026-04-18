const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Order= require("../models/Orders");
const sendEmail = require("../Utils/sendEmail");
const User = require("../models/User");
const  formatDate  = require("../Utils/FormateDate");
// Protected route
router.post("/checkout", protect, (req, res) => {
  res.json({
    success: true,
    message: "Checkout allowed 🎉",
    user: req.user,
  });
});

// routes/orderRoutes.js


// ✅ CREATE ORDER
// routes/orderRoutes.js

router.post("/create", protect, async (req, res) => {
  try {
    const { items, total, address, paymentMethod } = req.body;
    console.log("userId"+ req.user._id);

    const newOrder = new Order({
            userId: req.user._id, // 👈 THIS MUST WORK
      items,
      totalAmount: total,
      address,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "created"
    });

    await newOrder.save();
     // ✅ EMAIL (SAFE TRY-CATCH 🔥)
      // ✅ GET USER
    const user = await User.findById(req.user._id);
   try {
  await sendEmail(
    user.email,
    "Your Order is Confirmed 🛍️ | Karmaas",
    `
    <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
        
        <!-- HEADER -->
        <div style="background:#2e7d32; color:#fff; padding:20px; text-align:center;">
          <h2 style="margin:0;">Karmaas 🌿</h2>
          <p style="margin:5px 0 0;">Healthy Living Store</p>
        </div>

        <!-- BODY -->
        <div style="padding:20px; color:#333;">
          
          <h3>Hi ${user.name}, 👋</h3>
          
          <p>
            Thank you for your order! Your purchase has been successfully placed 🎉
          </p>

          <div style="background:#f1f1f1; padding:15px; border-radius:8px; margin:15px 0;">
            <p><strong>Order ID:</strong> ${newOrder._id}</p>
            <p><strong>Total Amount:</strong> ₹${total}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          </div>

          <p>
            We’re preparing your order and will notify you once it's shipped 🚚
          </p>

          <!-- BUTTON -->
          <div style="text-align:center; margin:20px 0;">
            <a href="https://karmaass.com" 
              style="background:#2e7d32; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
              Visit Our Store
            </a>
          </div>

          <p>
            If you have any questions, feel free to contact our support team.
          </p>

          <p>Thanks for shopping with us ❤️</p>

          <p><strong>Karmaas Team</strong></p>
        </div>

        <!-- FOOTER -->
        <div style="background:#fafafa; padding:15px; text-align:center; font-size:12px; color:#777;">
          <p>© 2026 Karmaas. All rights reserved.</p>
          <p>
            <a href="https://karmaass.com" style="color:#2e7d32;">www.karmaass.com</a>
          </p>
        </div>

      </div>

    </div>
    `
  );
} catch (emailErr) {
  console.log("Email failed ❌ but order created ✅", emailErr.message);
}


    res.json({
      success: true,
      orderId: newOrder._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET USER ORDERS
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE ORDER DETAILS
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// cancel order
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (["shipped", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now"
      });
    }

    // ✅ UPDATE ORDER
    order.orderStatus = "cancelled";
    order.cancelReason = req.body.reason;
    order.cancelledAt = new Date();

    await order.save();

    // ✅ GET USER
    const user = await User.findById(req.user._id);

    // ✅ SEND EMAIL (SAFE)
    try {
      await sendEmail(
        user.email,
        "Order Cancelled ❌ | Karmaas",
        `
        <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
          
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
            
            <!-- HEADER -->
            <div style="background:#c62828; color:#fff; padding:20px; text-align:center;">
              <h2 style="margin:0;">Karmaas 🌿</h2>
              <p style="margin:5px 0 0;">Order Cancelled</p>
            </div>

            <!-- BODY -->
            <div style="padding:20px; color:#333;">
              
              <h3>Hi ${user.name}, 👋</h3>
              
              <p>
                Your order has been successfully cancelled ❌
              </p>

              <div style="background:#f1f1f1; padding:15px; border-radius:8px; margin:15px 0;">
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Cancelled On:</strong> ${new Date(order.cancelledAt).toLocaleString()}</p>
                <p><strong>Reason:</strong> ${order.cancelReason || "Not specified"}</p>
              </div>

              <p>
                If you have already paid, your refund (if applicable) will be processed shortly 💰
              </p>

              <!-- BUTTON -->
              <div style="text-align:center; margin:20px 0;">
                <a href="https://karmaass.com" 
                  style="background:#2e7d32; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
                  Continue Shopping
                </a>
              </div>

              <p>
                We hope to serve you again soon ❤️
              </p>

              <p><strong>Karmaas Team</strong></p>
            </div>

            <!-- FOOTER -->
            <div style="background:#fafafa; padding:15px; text-align:center; font-size:12px; color:#777;">
              <p>© 2026 Karmaas. All rights reserved.</p>
              <p>
                <a href="https://karmaass.com" style="color:#2e7d32;">www.karmaass.com</a>
              </p>
            </div>

          </div>

        </div>
        `
      );
    } catch (emailErr) {
      console.log("Cancel email failed ❌ but order cancelled ✅", emailErr.message);
    }

    // ✅ RESPONSE
    res.json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
