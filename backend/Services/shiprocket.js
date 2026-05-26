const axios = require("axios");

let token = null;
let tokenExpiry = null;

/* ---------------- AUTH ---------------- */
const generateToken = async () => {
  const res = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  token = res.data.token;
  tokenExpiry = Date.now() + 55 * 60 * 1000;
  return token;
};

const getToken = async () => {
  if (!token || !tokenExpiry || Date.now() > tokenExpiry) {
    await generateToken();
  }
  return token;
};

/* ---------------- CREATE SHIPMENT ---------------- */
const createShipment = async (order) => {
  try {
    const authToken = await getToken();

    // ✅ VALIDATION
    for (const item of order.items) {
      console.log("shipped  item", item.sku);
      if (!item.sku) {
        return {
          success: false,
          error: "SKU missing in order items",
        };
      }
    }

    const payload = {
      order_id: order._id.toString(),

      order_date: new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),

      pickup_location: "work",

      billing_customer_name: order.address.name,
      billing_last_name: "",
      billing_address: order.address.addressLine,
      billing_address_2: order.address.houseNo || "",
      billing_city: order.address.city,
      billing_pincode: String(order.address.pincode),
      billing_state: order.address.state,
      billing_country: "India",
      billing_email: order.address.email || "customer@test.com",
      billing_phone: String(order.address.phone),

      shipping_is_billing: true,

      // ✅ IMPORTANT FIX HERE
      order_items: order.items.map((item) => ({
        name: item.name,

        // 🔥 REAL SKU (NOT productId)
        sku: item.sku  || item.productId.toString() ,

        units: item.quantity,
        selling_price: item.price,
      })),

      payment_method:
        order.paymentMethod === "ONLINE" ? "Prepaid" : "COD",

      sub_total: Number(order.totalAmount),

      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    const res = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = res.data;

    if (!data || data.status_code !== 1) {
      return {
        success: false,
        error: data?.message || "Shipment creation failed",
      };
    }

    return {
      success: true,
      shipmentId: data.shipment_id,
      shiprocketOrderId = data.order_id,
      awb: data.awb_code || "",
      courier: data.courier_name || "",
      trackingUrl: data.awb_code
        ? `https://shiprocket.co/tracking/${data.awb_code}`
        : "",
    };

  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};

module.exports = { createShipment,generateToken };