const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,shipOrder,syncShipment,
    createProduct,
  getProducts,
 getProduct,
  updateProduct,
  deleteProduct,
  getUsersCount,
  shiprocketWebhook
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware  = require("../middleware/authMiddleware");  
// console.log("protect:", typeof protect);
// console.log("adminMiddleware:", typeof adminMiddleware);
// console.log("shipOrder:", typeof shipOrder);

// 🔥 GET ALL ORDERS (ADMIN)
router.get("/orders", protect,adminMiddleware,getAllOrders);

// Get All Users Count
router.get("/users-count", protect,adminMiddleware, getUsersCount);

// // 🔥 UPDATE ORDER STATUS
router.put("/order/:id", protect,adminMiddleware,updateOrderStatus);

router.post("/ship/:id", protect,adminMiddleware, shipOrder);
// router.get(
// "/sync-shipment/:id",
// syncShipment
// );

router.post("/webhooks/shiprocket",shiprocketWebhook);


// product management routes

// CREATE PRODUCT
router.post(
  "/product/create",
  protect,
  adminMiddleware,
  createProduct
);

// GET ALL PRODUCTS
router.get(
  "/products",
  protect,
  adminMiddleware,
  getProducts
);

// GET SINGLE PRODUCT
router.get(
  "/product/:id",
  protect,
  adminMiddleware,
  getProduct
);

// UPDATE PRODUCT
router.put(
  "/product/:id",
  protect,
  adminMiddleware,
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/product/:id",
  protect,
  adminMiddleware,
  deleteProduct
);

module.exports = router;