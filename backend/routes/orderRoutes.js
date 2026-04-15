const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Order= require("../models/Orders");
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
module.exports = router;
