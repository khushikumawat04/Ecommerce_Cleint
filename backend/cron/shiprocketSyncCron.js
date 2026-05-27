const cron = require("node-cron");
const axios = require("axios");
const Order = require("../models/Order");
const {getToken }= require("../Services/shiprocket");

cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("🔄 Running Shiprocket Sync Cron");

    const token = await getToken();

    const orders = await Order.find({
      orderStatus: { $nin: ["delivered", "cancelled"] },
      awbCode: { $exists: true },
    });

    for (let order of orders) {
      try {
        const { data } = await axios.get(
          `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awbCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const statusRaw = data?.tracking_data?.shipment_status;
        if (!statusRaw) continue;

        const status = statusRaw.toUpperCase().replace(/\s+/g, "_");

        if (order.trackingStatus === status) continue;

        order.trackingStatus = status;
        order.lastCronAt = new Date();

        if (status.includes("PICK") || status.includes("TRANSIT") || status.includes("OUT")) {
          order.orderStatus = "shipped";
        }

        if (status.includes("DELIVERED")) {
          order.orderStatus = "delivered";
          order.deliveredAt = new Date();
        }

        if (status.includes("RTO")) {
          order.orderStatus = "cancelled";
        }

        await order.save();

        console.log(`✔ Updated ${order._id} → ${status}`);
      } catch (err) {
        console.log("Order sync error:", order._id, err.message);
      }
    }
  } catch (err) {
    console.error("CRON ERROR:", err.message);
  }
});

module.exports = {}; // important (just to keep file active)