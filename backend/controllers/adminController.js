const Order = require("../models/Orders");
const {createShipment,generateToken}  = require("../Services/shiprocket");
const User = require("../models/User");
const sendEmail = require("../Utils/SendEmail");
const formatDate = require("../Utils/FormateDate");
const axios = require("axios");
const Product = require("../models/Product");

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

exports.updateOrderStatus = async (req,res)=>{
try{

console.log("Update hit");

const status = req.body.status?.toLowerCase().trim();

const order = await Order.findById(req.params.id);

if(!order){
 return res.status(404).json({
  message:"Order not found"
 });
}

if(order.orderStatus==="cancelled"){
 return res.status(400).json({
   message:"Cancelled order cannot be updated"
 });
}

/* ADD THIS BLOCK HERE */
const validTransitions = {
  created: ["confirmed"],
  confirmed: ["processing"],   // ✅ allow move to processing
  processing: ["shipped"],     // ✅ allow move to shipped
  shipped: ["delivered"],      // ✅ final step
  delivered: [],               // ❌ locked
  cancelled: []                // ❌ locked
};

if(
!validTransitions[
order.orderStatus
].includes(status)
){
 return res.status(400).json({
   message:
`Invalid transition:
${order.orderStatus} -> ${status}`
 });
}
/* END BLOCK */

// update
order.orderStatus=status;

if(status==="shipped"){
 order.shippedAt=new Date();
}

if(status==="delivered"){
 order.deliveredAt=new Date();
}

await order.save();

const user=await User.findById(order.userId);

if(!user){
 return res.status(404).json({
   message:"User not found"
 });
}

try{

if (status === "shipped") {
  console.log("Sending shipped email");

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
  );
}


if (status === "delivered") {
  console.log("Sending delivered email");

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

}catch(emailErr){
 console.error("Email error:",emailErr);
}

res.json({
success:true,
message:"Order status updated",
order
});

}catch(err){
console.error(err);
res.status(500).json({
error:err.message
});
}
};


/* ---------------- SHIP ORDER ---------------- */

exports.shipOrder = async(req,res)=>{
try{

 const order = await Order.findById(req.params.id);

 if(!order){
   return res.status(404).json({
      success:false,
      message:"Order not found"
   });
 }


/* Already shipped check */
 if(
    order.orderStatus==="shipped"
 ){
   return res.status(400).json({
      success:false,
      message:"Order already shipped"
   });
 }


/* Cancelled check */
 if(
    order.orderStatus==="cancelled"
 ){
   return res.status(400).json({
      success:false,
      message:"Cancelled orders cannot be shipped"
   });
 }


 const shipment =
   await createShipment(order);

console.log(JSON.stringify(shipment,null,2))

const awb =
shipment?.awb_code || "";

const shipmentId =
shipment?.shipment_id || "";

await Order.findByIdAndUpdate(
order._id,
{
orderStatus:"processing",

shipmentId: shipmentId,

trackingId: awb,
awbCode: awb,

/* if courier not assigned yet */
courier:
shipment?.courier_name
? shipment.courier_name
: "Pending Assignment",

trackingUrl:
awb
? `https://shiprocket.co/tracking/${awb}`
: ""
}
);

 return res.json({
   success:true,
   message:"Order shipped successfully",
   shipment
 });


}catch(err){

 console.log(
  "SHIP ERROR:",
  JSON.stringify(
   err.response?.data || err.message,
   null,
   2
  )
 );

 return res.status(500).json({
   success:false,
   message:
      err.response?.data?.message ||
      "Shipment failed"
 });

}
};



/* make sure generateToken + token
exist in this file or import them */
// exports.syncShipment = async (req,res)=>{
// try{

// const order = await Order.findById(
// req.params.id
// );

// if(!order){
//  return res.status(404).json({
//   success:false,
//   message:"Order not found"
//  });
// }

// if(!order.shipmentId){
//  return res.status(400).json({
//   success:false,
//   message:"No shipment id found"
//  });
// }

// console.log(
// "Syncing shipment:",
// order.shipmentId
// );
//  console.log(await generateToken())

// /* fresh token */
// let token = await generateToken();

// let tracking;


// /* TRACKING CALL */
// try{

// tracking = await axios.get(
// `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${order.shipmentId}`,
// {
// headers:{
// Authorization:`Bearer ${token}`
// }
// }
// );

// }catch(err){

// /* auto retry if token expired */
// if(err.response?.status===401){

// console.log(
// "Token expired. Regenerating..."
// );

// token = await generateToken();


// tracking = await axios.get(
// `https://apiv2.shiprocket.in/v1/external/shipments/${order.shipmentId}`,
// {
// headers:{
// Authorization:`Bearer ${token}`
// }
// }
// );

// }else{
// throw err;
// }

// }



// console.log(
// "TRACKING RESPONSE:",
// JSON.stringify(
// tracking.data,
// null,
// 2
// )
// );


// const track =
// tracking.data?.tracking_data
// ?.shipment_track?.[0] || {};


// const awb =
// track.awb_code || "";

// const courier =
// track.courier_name ||
// order.courier ||
// "Pending Assignment";


// const shipmentStatus =
// track.current_status ||
// "Processing";



// await Order.findByIdAndUpdate(
// order._id,
// {
// awbCode:awb,

// trackingId:awb,

// courier:courier,

// trackingUrl:
// awb
// ? `https://shiprocket.co/tracking/${awb}`
// : "",

// shipmentStatus,

// awbSyncedAt:new Date()
// }
// );


// return res.json({
// success:true,
// message:
// awb
// ? "Tracking synced successfully"
// : "Shipment exists but AWB not assigned yet"
// });


// }catch(err){

// console.log(
// "====== SYNC ERROR ======"
// );

// console.log(
// "Status:",
// err.response?.status
// );

// console.log(
// "Data:",
// JSON.stringify(
// err.response?.data,
// null,
// 2
// )
// );

// console.log(
// "Message:",
// err.message
// );


// return res.status(500).json({
// success:false,
// message:
// err.response?.data?.message ||
// err.message ||
// "Tracking sync failed"
// });

// }
// };


// Webhook shiprocket


exports.shiprocketWebhook = async (req,res)=>{
try{

// optional security if you configured secret in Shiprocket
if(
process.env.SHIPROCKET_WEBHOOK_SECRET &&
req.headers["x-api-key"] !==
process.env.SHIPROCKET_WEBHOOK_SECRET
){
return res.sendStatus(401);
}

console.log(
"Shiprocket Webhook:",
JSON.stringify(req.body,null,2)
);

const {
shipment_id,
awb_code,
current_status,
shipment_status
} = req.body;


/*
Find order using shipment id
(primary key, much better than awb)
*/
const order = await Order.findOne({
shipmentId:String(shipment_id)
});

if(!order){
console.log(
"No order found for shipment:",
shipment_id
);
return res.sendStatus(200);
}


/*
Save AWB later when courier assigns it
*/
if(
awb_code &&
(!order.awbCode || order.awbCode==="")
){
order.awbCode=String(awb_code);
order.trackingId=String(awb_code);

order.trackingUrl=
`https://shiprocket.co/tracking/${awb_code}`;
}


/*
Normalize Shiprocket statuses
Adjust names after checking actual payloads
*/
const shiprocketStatus =
(current_status || shipment_status || "")
.toUpperCase()
.trim();


/*
Status mapping
*/
if(
[
"AWB_ASSIGNED",
"PICKUP_SCHEDULED",
"IN TRANSIT",
"OUT FOR DELIVERY"
].includes(shiprocketStatus)
){

// move processing -> shipped
if(order.orderStatus==="processing"){
order.orderStatus="shipped";
order.shippedAt=new Date();
   // ✅ SEND EMAIL
    const user = await User.findById(order.userId);

    if (user) {
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
  );
}

}

}

if (shiprocketStatus === "DELIVERED") {

  // ❌ Do not update if already delivered
  if (order.orderStatus === "delivered") {
    return res.sendStatus(200);
  }

  // ❌ Do not update cancelled orders
  if (order.orderStatus === "cancelled") {
    console.log("Cancelled order cannot be delivered");
    return res.sendStatus(200);
  }

  // ✅ Allow only valid transition
  if (order.orderStatus === "shipped") {
    order.orderStatus = "delivered";
    order.deliveredAt = new Date();
     // ✅ SEND EMAIL
    const user = await User.findById(order.userId);

    if (user) {
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
  } else {
    console.log(
      `Invalid delivery transition: ${order.orderStatus} → delivered`
    );
  }
}

if(shiprocketStatus==="RTO"){
order.orderStatus="cancelled";
}


/*
Save changes
*/
await order.save();

console.log(
`Order ${order._id} updated -> ${order.orderStatus}`
);

return res.sendStatus(200);

}catch(err){

console.error(
"Shiprocket webhook error:",
err
);

return res.sendStatus(500);
}
};

// product Management




// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
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