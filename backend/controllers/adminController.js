const Order = require("../models/Orders");
const {createShipment,generateToken}  = require("../Services/shiprocket");
const User = require("../models/User");
const sendEmail = require("../Utils/SendEmail");
const formatDate = require("../Utils/FormateDate");
const axios = require("axios");
const Product = require("../models/Product");
const generateSKU = require("../Utils/generateSKU");


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

// Get all users (Admin)
// Get total number of users except admin
exports.getUsersCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: { $ne: "admin" }
    });

    res.status(200).json({
      success: true,
      totalUsers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users count"
    });
  }
};

// exports.updateOrderStatus = async (req,res)=>{
// try{

// console.log("Update hit");

// const status = req.body.status?.toLowerCase().trim();

// const order = await Order.findById(req.params.id);

// if(!order){
//  return res.status(404).json({
//   message:"Order not found"
//  });
// }

// if(order.orderStatus==="cancelled"){
//  return res.status(400).json({
//    message:"Cancelled order cannot be updated"
//  });
// }

// /* ADD THIS BLOCK HERE */
// const validTransitions = {
//   created: ["confirmed"],
//   confirmed: ["processing"],   // ✅ allow move to processing
//   processing: ["shipped"],     // ✅ allow move to shipped
//   shipped: ["delivered"],      // ✅ final step
//   delivered: [],               // ❌ locked
//   cancelled: []                // ❌ locked
// };

// if(
// !validTransitions[
// order.orderStatus
// ].includes(status)
// ){
//  return res.status(400).json({
//    message:
// `Invalid transition:
// ${order.orderStatus} -> ${status}`
//  });
// }
// /* END BLOCK */

// // update
// order.orderStatus=status;

// if(status==="shipped"){
//  order.shippedAt=new Date();
// }

// if(status==="delivered"){
//  order.deliveredAt=new Date();
// }

// await order.save();

// const user=await User.findById(order.userId);

// if(!user){
//  return res.status(404).json({
//    message:"User not found"
//  });
// }

// try{

// if (status === "shipped") {
//   console.log("Sending shipped email");

//   await sendEmail(
//     user.email,
//     "Your Order Has Been Shipped 🚚 | Karmaas",
//     `
//     <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

//       <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

//         <!-- HEADER -->
//         <div style="background:#1e88e5;color:#fff;padding:20px;text-align:center;">
//           <h2 style="margin:0;">KARMAA'S 🌿</h2>
//           <p style="margin-top:5px;">Your Order is On the Way</p>
//         </div>

//         <!-- BODY -->
//         <div style="padding:25px;color:#333;">

//           <h3>Hi ${user.name}, 👋</h3>

//           <p>Great news! Your order has been <b>shipped successfully</b> 🚚</p>

//           <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>Shipped On:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>Status:</strong> Shipped 🚚</p>
//           </div>

//           <p>Your package is on its way and will reach you soon. You will receive updates as it moves.</p>

//           <div style="text-align:center;margin:20px 0;">
//             <a href="https://karmaass.com"
//               style="background:#2e7d32;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
//               Track Order
//             </a>
//           </div>

//           <p>Thank you for shopping with us ❤️</p>

//           <p><b>Karmaas Team</b></p>

//         </div>

//       </div>
//     </div>
//     `
//   );
// }


// if (status === "delivered") {
//   console.log("Sending delivered email");

//   await sendEmail(
//     user.email,
//     "Order Delivered 🎉 | Karmaas",
//     `
//     <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

//       <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

//         <!-- HEADER -->
//         <div style="background:#2e7d32;color:#fff;padding:20px;text-align:center;">
//           <h2 style="margin:0;">KARMAA'S 🌿</h2>
//           <p style="margin-top:5px;">Order Successfully Delivered</p>
//         </div>

//         <!-- BODY -->
//         <div style="padding:25px;color:#333;">

//           <h3>Hi ${user.name}, 👋</h3>

//           <p>Your order has been <b>delivered successfully</b> 🎉</p>

//           <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>Delivered On:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>Status:</strong> Delivered 🎉</p>
//           </div>

//           <p>We hope you loved your purchase ❤️</p>
//           <p>If you have any feedback, feel free to reach out.</p>

//           <div style="text-align:center;margin:20px 0;">
//             <a href="https://karmaass.com"
//               style="background:var(--primary-color);color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
//               Shop Again
//             </a>
//           </div>

//           <p>We look forward to serving you again 🙏</p>

//           <p><b>Karmaas Team</b></p>

//         </div>

//       </div>
//     </div>
//     `
//   );
// }

// }catch(emailErr){
//  console.error("Email error:",emailErr);
// }

// res.json({
// success:true,
// message:"Order status updated",
// order
// });

// }catch(err){
// console.error(err);
// res.status(500).json({
// error:err.message
// });
// }
// };


exports.updateOrderStatus = async (req, res) => {
  try {
    console.log("Update hit");

    const status = req.body.status?.toLowerCase().trim();

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // block updates after delivered/cancelled (final states)
    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order already ${order.orderStatus}, cannot be updated`
      });
    }

    // NEW FLOW TRANSITIONS
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["ready_to_ship", "cancelled"],
      ready_to_ship: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
      returned: []
    };

    const allowedNext = validTransitions[order.orderStatus] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Invalid transition: ${order.orderStatus} -> ${status}`
      });
    }

    // update status
    order.orderStatus = status;

    // timestamps
    if (status === "shipped") {
      order.shippedAt = new Date();
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    const user = await User.findById(order.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // EMAILS
    try {
      // SHIPPED EMAIL
      if (status === "shipped") {
        console.log("Sending shipped email");

        await sendEmail(
          user.email,
          "Your Order Has Been Shipped 🚚 | Karmaas",
          `Your order ${order._id} has been shipped.`
        );
      }

      // DELIVERED EMAIL
      if (status === "delivered") {
        console.log("Sending delivered email");

        await sendEmail(
          user.email,
          "Order Delivered 🎉 | Karmaas",
          `Your order ${order._id} has been delivered.`
        );
      }
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return res.json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message
    });
  }
};

/* ---------------- SHIP ORDER ---------------- */


exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "shipped") {
      return res.status(400).json({
        success: false,
        message: "Order already shipped",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be shipped",
      });
    }
console.log("Shipping order:", order.items);
    const shipment = await createShipment(order);

    console.log("📦 Shiprocket Response:", shipment);

    if (!shipment.success) {
      return res.status(400).json({
        success: false,
        message: shipment.error,
      });
    }

    await Order.findByIdAndUpdate(order._id, {
          orderStatus: "ready_to_ship", // 🔥 FIXED (not processing)
      shipmentId: shipment.shipmentId,
      awbCode: shipment.awb,
      trackingId: shipment.awb,
      courier: shipment.courier || "Pending Assignment",
      trackingUrl: shipment.trackingUrl,
    });

    return res.json({
      success: true,
      message: "Order shipped successfully",
      shipment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};



// exports.shiprocketWebhook = async (req,res)=>{
// try{

// // optional security if you configured secret in Shiprocket
// if(
// process.env.SHIPROCKET_WEBHOOK_SECRET &&
// req.headers["x-api-key"] !==
// process.env.SHIPROCKET_WEBHOOK_SECRET
// ){
// return res.sendStatus(401);
// }

// console.log(
// "Shiprocket Webhook:",
// JSON.stringify(req.body,null,2)
// );

// const {
// shipment_id,
// awb_code,
// current_status,
// shipment_status
// } = req.body;


// /*
// Find order using shipment id
// (primary key, much better than awb)
// */
// const order = await Order.findOne({
// shipmentId:String(shipment_id)
// });

// if(!order){
// console.log(
// "No order found for shipment:",
// shipment_id
// );
// return res.sendStatus(200);
// }


// /*
// Save AWB later when courier assigns it
// */
// if(
// awb_code &&
// (!order.awbCode || order.awbCode==="")
// ){
// order.awbCode=String(awb_code);
// order.trackingId=String(awb_code);

// order.trackingUrl=
// `https://shiprocket.co/tracking/${awb_code}`;
// }


// /*
// Normalize Shiprocket statuses
// Adjust names after checking actual payloads
// */
// const shiprocketStatus =
// (current_status || shipment_status || "")
// .toUpperCase()
// .trim();


// /*
// Status mapping
// */
// if(
// [
// "AWB_ASSIGNED",
// "PICKUP_SCHEDULED",
// "IN TRANSIT",
// "OUT FOR DELIVERY"
// ].includes(shiprocketStatus)
// ){

// // move processing -> shipped
// if(order.orderStatus==="processing"){
// order.orderStatus="shipped";
// order.shippedAt=new Date();
//    // ✅ SEND EMAIL
//     const user = await User.findById(order.userId);

//     if (user) {
//        await sendEmail(
//     user.email,
//     "Your Order Has Been Shipped 🚚 | Karmaas",
//     `
//     <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

//       <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

//         <!-- HEADER -->
//         <div style="background:#1e88e5;color:#fff;padding:20px;text-align:center;">
//           <h2 style="margin:0;">KARMAA'S 🌿</h2>
//           <p style="margin-top:5px;">Your Order is On the Way</p>
//         </div>

//         <!-- BODY -->
//         <div style="padding:25px;color:#333;">

//           <h3>Hi ${user.name}, 👋</h3>

//           <p>Great news! Your order has been <b>shipped successfully</b> 🚚</p>

//           <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>Shipped On:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>Status:</strong> Shipped 🚚</p>
//           </div>

//           <p>Your package is on its way and will reach you soon. You will receive updates as it moves.</p>

//           <div style="text-align:center;margin:20px 0;">
//             <a href="https://karmaass.com"
//               style="background:#2e7d32;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
//               Track Order
//             </a>
//           </div>

//           <p>Thank you for shopping with us ❤️</p>

//           <p><b>Karmaas Team</b></p>

//         </div>

//       </div>
//     </div>
//     `
//   );
// }

// }

// }

// if (shiprocketStatus === "DELIVERED") {

//   // ❌ Do not update if already delivered
//   if (order.orderStatus === "delivered") {
//     return res.sendStatus(200);
//   }

//   // ❌ Do not update cancelled orders
//   if (order.orderStatus === "cancelled") {
//     console.log("Cancelled order cannot be delivered");
//     return res.sendStatus(200);
//   }

//   // ✅ Allow only valid transition
//   if (order.orderStatus === "shipped") {
//     order.orderStatus = "delivered";
//     order.deliveredAt = new Date();
//      // ✅ SEND EMAIL
//     const user = await User.findById(order.userId);

//     if (user) {
//       await sendEmail(
//     user.email,
//     "Order Delivered 🎉 | Karmaas",
//     `
//     <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

//       <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

//         <!-- HEADER -->
//         <div style="background:#2e7d32;color:#fff;padding:20px;text-align:center;">
//           <h2 style="margin:0;">KARMAA'S 🌿</h2>
//           <p style="margin-top:5px;">Order Successfully Delivered</p>
//         </div>

//         <!-- BODY -->
//         <div style="padding:25px;color:#333;">

//           <h3>Hi ${user.name}, 👋</h3>

//           <p>Your order has been <b>delivered successfully</b> 🎉</p>

//           <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>Delivered On:</strong> ${new Date().toLocaleString()}</p>
//             <p><strong>Status:</strong> Delivered 🎉</p>
//           </div>

//           <p>We hope you loved your purchase ❤️</p>
//           <p>If you have any feedback, feel free to reach out.</p>

//           <div style="text-align:center;margin:20px 0;">
//             <a href="https://karmaass.com"
//               style="background:var(--primary-color);color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
//               Shop Again
//             </a>
//           </div>

//           <p>We look forward to serving you again 🙏</p>

//           <p><b>Karmaas Team</b></p>

//         </div>

//       </div>
//     </div>
//     `
//   );
//     }
//   } else {
//     console.log(
//       `Invalid delivery transition: ${order.orderStatus} → delivered`
//     );
//   }
// }

// if(shiprocketStatus==="RTO"){
// order.orderStatus="cancelled";
// }


// /*
// Save changes
// */
// await order.save();

// console.log(
// `Order ${order._id} updated -> ${order.orderStatus}`
// );

// return res.sendStatus(200);

// }catch(err){

// console.error(
// "Shiprocket webhook error:",
// err
// );

// return res.sendStatus(500);
// }
// };




exports.shiprocketWebhook = async (req, res) => {
  try {
    // ---------------- SECURITY CHECK ----------------
    if (
      process.env.SHIPROCKET_WEBHOOK_SECRET &&
      req.headers["x-api-key"] !== process.env.SHIPROCKET_WEBHOOK_SECRET
    ) {
      return res.sendStatus(401);
    }

    const {
      shipment_id,
      awb_code,
      current_status,
      shipment_status,
    } = req.body;

    console.log("Shiprocket Webhook:", req.body);
    console.log(
  "WEBHOOK BODY:",
  JSON.stringify(req.body, null, 2)
);

    // ---------------- FIND ORDER ----------------
    const order = await Order.findOne({
      shipmentId: String(shipment_id),
    });

    if (!order) {
      console.log("No order found:", shipment_id);
      return res.sendStatus(200);
    }

    // ---------------- SAVE AWB ----------------
    if (awb_code && !order.awbCode) {
      order.awbCode = awb_code;
      order.trackingId = awb_code;
      order.trackingUrl = `https://shiprocket.co/tracking/${awb_code}`;
    }

    // ---------------- NORMALIZE STATUS ----------------
    const statusRaw = (current_status || shipment_status || "")
      .toString()
      .toUpperCase()
      .trim()
      .replace(/\s+/g, "_"); // IN TRANSIT → IN_TRANSIT

    console.log("Normalized Status:", statusRaw);

    // ---------------- SHIPPED STATES ----------------
    const shippedStates = [
      "AWB_ASSIGNED",
      "PICKUP_SCHEDULED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
    ];

    // ---------------- DELIVERED STATES ----------------
    const deliveredStates = [
      "DELIVERED",
      "DELIVERED_TO_CUSTOMER",
      "SHIPMENT_DELIVERED",
    ];

    // ---------------- RTO STATES ----------------
    const rtoStates = [
      "RTO_INITIATED",
      "RTO_DELIVERED",
      "RETURN_TO_ORIGIN",
      "RTO_IN_TRANSIT",
    ];

    // ================= SHIPPED =================
    if (
      shippedStates.includes(statusRaw) &&
      order.orderStatus === "ready_to_ship"
    ) {
      order.orderStatus = "shipped";
      order.shippedAt = new Date();

      setImmediate(async () => {
        try {
          const user = await User.findById(order.userId);

          if (user?.email) {
         await sendEmail(
    user.email,
    "Your Order Has Been Shipped 🚚 | Karmaas",
    `
    <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

      <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#1e88e5;color:#fff;padding:20px;text-align:center;">
          <h2 style="margin:0;">KARMAA'S 🌿</h2>
          <p style="margin-top:5px;">Your Order is On the Way</p>
        </div>

        <!-- BODY -->
        <div style="padding:25px;color:#333;">

          <h3>Hi ${user.name}, 👋</h3>

          <p>Great news! Your order has been <b>shipped successfully</b> 🚚</p>

          <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Shipped On:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Shipped 🚚</p>
          </div>

          <p>Your package is on its way and will reach you soon. You will receive updates as it moves.</p>

          <div style="text-align:center;margin:20px 0;">
            <a href="https://karmaass.com"
              style="background:#2e7d32;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
              Track Order
            </a>
          </div>

          <p>Thank you for shopping with us ❤️</p>

          <p><b>Karmaas Team</b></p>

        </div>

      </div>
    </div>
    `
  );          }
        } catch (e) {
          console.log("Email error:", e.message);
        }
      });
    }

    // ================= DELIVERED =================
    if (
  deliveredStates.includes(statusRaw) &&
  ["shipped", "ready_to_ship"].includes(order.orderStatus)
)  {
      order.orderStatus = "delivered";
      order.deliveredAt = new Date();

      setImmediate(async () => {
        try {
          const user = await User.findById(order.userId);

          if (user?.email) {
                      await sendEmail(
    user.email,
    "Order Delivered 🎉 | Karmaas",
    `
    <div style="font-family:Arial;background:#f6f6f6;padding:20px;">

      <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">

        <!-- HEADER -->
        <div style="background:#2e7d32;color:#fff;padding:20px;text-align:center;">
          <h2 style="margin:0;">KARMAA'S 🌿</h2>
          <p style="margin-top:5px;">Order Successfully Delivered</p>
        </div>

        <!-- BODY -->
        <div style="padding:25px;color:#333;">

          <h3>Hi ${user.name}, 👋</h3>

          <p>Your order has been <b>delivered successfully</b> 🎉</p>

          <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Delivered On:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Delivered 🎉</p>
          </div>

          <p>We hope you loved your purchase ❤️</p>
          <p>If you have any feedback, feel free to reach out.</p>

          <div style="text-align:center;margin:20px 0;">
            <a href="https://karmaass.com"
              style="background:var(--primary-color);color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">
              Shop Again
            </a>
          </div>

          <p>We look forward to serving you again 🙏</p>

          <p><b>Karmaas Team</b></p>

        </div>

      </div>
    </div>
    `
  );
          }
        } catch (e) {
          console.log("Email error:", e.message);
        }
      });
    }

    // ================= RTO =================
    if (rtoStates.includes(statusRaw)) {
      order.orderStatus = "cancelled";
    }

    // ---------------- SAVE ----------------
    await order.save();

    console.log(`Order updated: ${order._id} -> ${order.orderStatus}`);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook Error:", err);
    return res.sendStatus(500);
  }
};


// product Management




// CREATE PRODUCT





exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);

    // 🔥 AUTO SKU GENERATION
    product.sku = await generateSKU(product);

    await product.save();

    res.status(201).json({
      success: true,
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};