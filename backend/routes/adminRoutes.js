const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,shipOrder
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware  = require("../middleware/authMiddleware");  
// console.log("protect:", typeof protect);
// console.log("adminMiddleware:", typeof adminMiddleware);
// console.log("shipOrder:", typeof shipOrder);

// 🔥 GET ALL ORDERS (ADMIN)
router.get("/orders", protect,adminMiddleware, getAllOrders);

// // 🔥 UPDATE ORDER STATUS
router.put("/order/:id", protect,adminMiddleware, updateOrderStatus);

router.post("/ship/:id", protect,adminMiddleware, shipOrder);

module.exports = router;