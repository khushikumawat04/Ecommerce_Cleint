const axios = require("axios");
const Order = require("../models/Orders");

let token = null;


/* ---------------- AUTH TOKEN ---------------- */

const generateToken = async () => {

 try{
   const response = await axios.post(
     "https://apiv2.shiprocket.in/v1/external/auth/login",
     {
       email: process.env.SHIPROCKET_EMAIL,
       password: process.env.SHIPROCKET_PASSWORD
     }
   );

   token = response.data.token;

 }catch(err){
   console.error("Token Error:", err.response?.data || err.message);
   throw err;
 }

};



/* ---------------- CREATE SHIPMENT ---------------- */

const createShipment = async (order) => {

 if(!token){
   await generateToken();
 }

 const payload = {
   order_id: String(order._id),

   order_date: new Date()
      .toISOString()
      .slice(0,19)
      .replace("T"," "),

   pickup_location:"work",

   billing_customer_name:
      order.address.name,

   billing_last_name:"",

   billing_address:
      order.address.addressLine,

   billing_address_2:
      order.address.houseNo,

   billing_city:
      order.address.city,

   billing_pincode:
      String(order.address.pincode),

   billing_state:
      order.address.state,

   billing_country:"India",

   billing_email:
      "customer@test.com", // replace if you store email

   billing_phone:
      String(order.address.phone),

   shipping_customer_name:
      order.address.name,

   shipping_last_name:"",

   shipping_address:
      order.address.addressLine,

   shipping_address_2:
      order.address.houseNo,

   shipping_city:
      order.address.city,

   shipping_pincode:
      String(order.address.pincode),

   shipping_state:
      order.address.state,

   shipping_country:"India",

   shipping_email:
      "customer@test.com",

   shipping_phone:
      String(order.address.phone),

   shipping_is_billing:false,

   order_items:
      order.items.map(item=>({
        name:item.name,
        sku:item.productId || "SKU001",
        units:item.quantity,
        selling_price:item.price
      })),

   payment_method:
      order.paymentMethod==="ONLINE"
      ? "Prepaid"
      : "COD",

   sub_total: order.totalAmount,

   length:10,
   breadth:10,
   height:10,
   weight:1
 };


 console.log(
   "SHIPMENT PAYLOAD:",
   JSON.stringify(payload,null,2)
 );


 const response = await axios.post(
   "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
   payload,
   {
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      }
   }
 );

 return response.data;
};




module.exports = { generateToken, createShipment };