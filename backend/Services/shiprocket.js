const axios = require("axios");

let token = "";

// 🔐 GET TOKEN
const generateToken = async () => {
  try {
    console.log("email:", process.env.SHIPROCKET_EMAIL);
    console.log("password:", process.env.SHIPROCKET_PASSWORD);

    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      }
    );

    token = res.data.token;
    return token;

  } catch (err) {
    console.log("Shiprocket Auth Error:", err.response?.data);
  }
};

// 📦 CREATE SHIPMENT
const createShipment = async (order) => {
  try {
    if (!token) await generateToken();
console.log("ORDER ADDRESS:", order.address);
   const response = await axios.post(
  "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
  {
    order_id: "TEST123",
    order_date: "2026-04-14",

    pickup_location: "Primary",

    // ✅ FULL HARDCODE ADDRESS (WORKING FORMAT)
    billing_customer_name: "Test User",
    billing_last_name: "",

    billing_address: "MG Road",
    billing_address_2: "House 123",

    billing_city: "Indore",
    billing_pincode: "452001",
    billing_state: "Madhya Pradesh",
    billing_country: "India",

    billing_email: "testuser@gmail.com",
    billing_phone: "9876543210",

    shipping_is_billing: true,

    // ✅ ITEMS
    order_items: [
      {
        name: "Test Product",
        sku: "SKU123",
        units: 1,
        selling_price: 100
      }
    ],

    payment_method: "Prepaid",

    sub_total: 100,

    // ✅ DIMENSIONS
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    return response.data;

  } catch (err) {
    console.log("Shiprocket Error:", err.response?.data);
    throw err;
  }
};

module.exports = { generateToken, createShipment };