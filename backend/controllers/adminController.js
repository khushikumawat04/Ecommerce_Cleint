const Order = require("../models/Orders");
const {createShipment}  = require("../Services/shiprocket");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const formatDate = require("../Utils/FormateDate");

// 🔥 GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
      console.log("Orders api hit");
  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE ORDER STATUS

exports.updateOrderStatus = async (req, res) => {
  console.log("Order status update API hit");

  try {
    const { status } = req.body;

    // ✅ FIND ORDER
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Prevent update if cancelled
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be updated"
      });
    }

    // ✅ UPDATE STATUS
    order.orderStatus = status;

    // ✅ SET TIMESTAMPS
    if (status === "shipped") {
      order.shippedAt = formatDate(new Date());
    }

    if (status === "delivered") {
      order.deliveredAt = formatDate(new Date());
    }

    await order.save();

    // ✅ GET USER
    const user = await User.findById(order.userId);

    // ================= EMAIL TRIGGERS =================

    try {

      // 📦 SHIPPED EMAIL
      if (status === "shipped") {
        await sendEmail(
          user.email,
          "Order Shipped 🚚 | Karmaas",
          `
          <h2>Hi ${user.name},</h2>
          <p>Your order <b>${order._id}</b> has been shipped 🚚</p>
          <p>It will reach you soon.</p>
          <a href="https://karmaass.com">Track Order</a>
          `
        );
      }

      // 🎉 DELIVERED EMAIL
      if (status === "delivered") {
        await sendEmail(
          user.email,
          "Order Delivered 🎉 | Karmaas",
          `
          <div style="font-family: Arial; padding:20px;">
            <h2>Hi ${user.name}, 👋</h2>

            <p>Your order has been successfully delivered 🎉</p>

            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Date:</strong> ${formatDate(new Date())}</p>

            <p>We hope you loved your purchase ❤️</p>

            <a href="https://karmaass.com"
              style="background:#2e7d32; color:white; padding:10px 15px; text-decoration:none;">
              Shop Again
            </a>
          </div>
          `
        );
      }

    } catch (emailErr) {
      console.log("Email failed ❌ but status updated ✅");
    }

    // ✅ RESPONSE
    res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🚚 SHIP ORDER (REAL)
exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // 🔥 CALL SHIPROCKET
    const shipment = await createShipment(order);

    console.log("SHIPROCKET RESPONSE:", shipment);

    // ✅ SAVE DETAILS
    order.orderStatus = "shipped";
    order.trackingId = shipment?.shipment_id || "N/A";
    order.courier = shipment?.courier_name || "Shiprocket";

    await order.save();

    res.json({
      success: true,
      message: "Shipment created 🚚",
      shipment
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
// 🧱 STEP 5: UPDATE ORDER