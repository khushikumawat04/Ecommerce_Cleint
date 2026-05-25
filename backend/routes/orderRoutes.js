const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Order= require("../models/Orders");
const sendEmail = require("../Utils/SendEmail");
const User = require("../models/User");
const  formatDate  = require("../Utils/FormateDate");
const Offer = require("../models/Offer");
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

// router.post("/create", protect, async (req, res) => {

// try {

// const {
// items,
// total,
// address,
// paymentMethod,
// paymentId,
// razorpayOrderId,
// subtotal,
// discount,
// couponCode
// } = req.body;


// /* ---------- COUPON REVALIDATION ---------- */

// let verifiedDiscount = discount || 0;
// let verifiedTotal = total;

// if (couponCode) {

// const offer = await Offer.findOne({
// code: couponCode.toUpperCase(),
// active: true
// });

// if (offer) {

// verifiedDiscount =
// (subtotal * offer.discountPercent) / 100;

// verifiedTotal =
// subtotal - verifiedDiscount;

// }

// }


// /* ---------- PAYMENT STATUS LOGIC ---------- */

// let paymentStatus = "pending";
// let orderStatus = "pending";

// // COD
// if (paymentMethod === "COD") {

// paymentStatus = "pending";
// orderStatus = "confirmed";

// }

// // ONLINE
// if (paymentMethod === "ONLINE") {

// paymentStatus = "pending";
// orderStatus = "pending";

// }


// /* ---------- CREATE ORDER ---------- */

// // const order = await Order.create({

// // userId: req.user._id,

// // items,

// // totalAmount: verifiedTotal,

// // address,

// // paymentMethod,

// // paymentStatus,

// // orderStatus,

// // razorpayOrderId: razorpayOrderId || null,

// // razorpayPaymentId: paymentId || null,

// // subtotal,

// // discount: verifiedDiscount,

// // couponCode

// // });

// router.post("/create", protect, async (req,res)=>{
// try{

// const {
// items,
// subtotal,
// discount,
// total,
// couponCode,
// address,
// paymentMethod
// }=req.body;

// let verifiedDiscount = discount || 0;
// let verifiedTotal = total;

// if(couponCode){

// const offer = await Offer.findOne({
// code: couponCode.toUpperCase(),
// active:true
// });

// if(offer){

// verifiedDiscount =
// (subtotal * offer.discountPercent)/100;

// verifiedTotal =
// subtotal - verifiedDiscount;

// }

// }

// const order = await Order.create({

// userId:req.user._id,

// items,

// subtotal,

// discount: verifiedDiscount,

// couponCode,

// totalAmount: verifiedTotal,

// address,

// paymentMethod,

// // IMPORTANT
// paymentStatus:"pending",

// orderStatus:"pending"

// });

// res.json({
// success:true,
// orderId:order._id
// });

// }catch(err){

// res.status(500).json({
// success:false,
// message:err.message
// });

// }
// });
// /* ---------- RESPONSE ---------- */

// res.json({
// success: true,
// orderId: order._id
// });


// /* ---------- EMAILS ONLY FOR COD ---------- */

// if (paymentMethod === "COD") {

// try {

// const user =
// await User.findById(req.user._id);

// await Promise.all([

// sendEmail(
// user.email,
// "Order Confirmed 🛍️ | Karmaas",
// `
// <h2>Order Confirmed</h2>
// <p>Your COD order has been placed successfully.</p>
// <p>Order ID: ${order._id}</p>
// `
// ),

// sendEmail(
// process.env.EMAIL_USER,
// `New COD Order #${order._id}`,
// `
// <h2>New COD Order</h2>
// <p>Customer: ${user.name}</p>
// <p>Total: ₹${verifiedTotal}</p>
// `
// )

// ]);

// } catch (emailErr) {

// console.log(
// "COD email error:",
// emailErr.message
// );

// }

// }

// } catch (err) {

// res.status(500).json({
// success:false,
// error: err.message
// });

// }

// });


router.post("/create", protect, async (req, res) => {

try {

const {
items,
subtotal,
discount,
total,
couponCode,
address,
paymentMethod
} = req.body;

// =======================
// VERIFY COUPON
// =======================

let verifiedDiscount = discount || 0;
let verifiedTotal = total;

if (couponCode) {

const offer = await Offer.findOne({
code: couponCode.toUpperCase(),
active: true
});

if (offer) {

verifiedDiscount =
(subtotal * offer.discountPercent) / 100;

verifiedTotal =
subtotal - verifiedDiscount;

}

}

    // =======================
    // 🔥 FIX: ATTACH SKU HERE
    // =======================
    const itemsWithSKU = await Promise.all(
      items.map(async (item) => {
        // assuming Product collection has sku stored
        const product = await Product.findById(item._id);

        return {
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,

          // 🔥 ADD SKU HERE
          sku: product?.sku || `KMA-GEN-${item._id}`
        };
      })
    );

// =======================
// PAYMENT STATUS
// =======================

let paymentStatus = "pending";
let orderStatus = "pending";

if (paymentMethod === "COD") {

paymentStatus = "pending";
orderStatus = "confirmed";

}

// =======================
// CREATE ORDER
// =======================

const order = await Order.create({

userId: req.user._id,

items: itemsWithSKU,

subtotal,

discount: verifiedDiscount,

couponCode,

totalAmount: verifiedTotal,

address,

paymentMethod,

paymentStatus,

orderStatus

});

// =======================
// RESPONSE
// =======================

res.json({
success: true,
orderId: order._id
});

} catch (err) {

console.log(err);

res.status(500).json({
success: false,
message: err.message
});

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
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Only owner can cancel
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // Prevent cancel after shipped/delivered
    if (["shipped", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now"
      });
    }

    // Update order
    order.orderStatus = "cancelled";
    order.cancelReason = req.body.reason || "Not specified";
    order.cancelledAt = new Date();

    await order.save();
  res.json({
      success: true,
      message: "Order cancelled successfully"
    });

    // Get customer
    const user = await User.findById(req.user._id);

    // -----------------------------
    // EMAILS (Customer + Admin)
    // -----------------------------
   

      const customerEmailHtml = `
      <div style="font-family:Arial;background:#f6f6f6;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

          <div style="background:#c62828;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;">Karmaas 🌿</h2>
            <p style="margin-top:8px;">Order Cancelled</p>
          </div>

          <div style="padding:25px;color:#333;">

            <h3>Hi ${user.name}, 👋</h3>

            <p>Your order has been successfully cancelled ❌</p>

            <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
              <p><strong>Order ID:</strong> ${order._id}</p>


              <p><strong>Cancelled On:</strong> ${new Date(
                order.cancelledAt
              ).toLocaleString()}</p>
               ${
                order.items?.length
                  ? `
                <p><strong>Cancelled Items:</strong></p>
                <ul>
                  ${order.items
                    .map(
                      item =>
                        `<li>${item.name} x ${item.quantity}</li>`
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
              <p><strong>Reason:</strong> ${order.cancelReason}</p>
            </div>

            <p style="margin-top:15px;">
              If payment was made, refund (if applicable) will be processed shortly 💰
            </p>

            <div style="text-align:center;margin:25px 0;">
              <a href="https://karmaass.com"
                style="background:#2e7d32;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;">
                Continue Shopping
              </a>
            </div>

            <p>We hope to serve you again ❤️</p>

            <p><strong>Karmaas Team</strong></p>

          </div>

          <div style="background:#fafafa;padding:15px;text-align:center;font-size:12px;color:#777;">
            © 2026 Karmaas
          </div>

        </div>
      </div>
      `;


      const adminEmailHtml = `
      <div style="font-family:Arial;background:#f6f6f6;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

          <div style="background:#b71c1c;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;">Customer Cancelled Order Alert ❌</h2>
          </div>

          <div style="padding:25px;color:#333;">

            <h3>Order Cancelled by Customer</h3>

            <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
              <p><strong>Order ID:</strong> ${order._id}</p>
      
              <p><strong>Customer:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Cancelled On:</strong> ${new Date(
                order.cancelledAt
              ).toLocaleString()}</p>
              <p><strong>Reason:</strong> ${order.cancelReason}</p>
              <p><strong>Total:</strong> ₹${order.totalAmount || order.total || "-"}</p>

              ${
                order.items?.length
                  ? `
                <p><strong>Cancelled Items:</strong></p>
                <ul>
                  ${order.items
                    .map(
                      item =>
                        `<li>${item.name} x ${item.quantity}</li>`
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }

            </div>

            <div style="text-align:center;margin:25px 0;">
              <a href="https://karmaass.com/admin/orders"
                style="background:#2e7d32;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;">
                View Orders
              </a>
            </div>

          </div>

        </div>
      </div>
      `;


      // Send both emails without breaking if one fails
    (async () => {
  try {

    const user = await User.findById(req.user._id);

    await Promise.allSettled([
      sendEmail(user.email, "Order Cancelled ❌ | Karmaas", customerEmailHtml),
      sendEmail("karmaas.in@gmail.com", "Customer Cancelled Order Alert ❌", adminEmailHtml)
    ]);

  } catch (err) {
    console.log("Email error:", err.message);
  }
})(); 

} catch (err) {
  res.status(500).json({ error: err.message });
}

});
module.exports = router;
