const express = require("express");
const router = express.Router();

const { getAllProducts,getSingleProduct } = require("../controllers/productController");

// GET products
router.get("/", getAllProducts);
// GET single product
router.get("/:id", getSingleProduct);

module.exports = router;