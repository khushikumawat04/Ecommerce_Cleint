const cron = require("node-cron");
const axios = require("axios");
const Order = require("../models/Orders");
const { getToken } = require("../Services/shiprocket");

/* ==============================
   🚀 SHIPROCKET TRACKING CRON
   SAFE + PRODUCTION READY
============================== */
cron.schedule("*/30 * * * *", async () => {
  console.log("🔄 Backup tracking cron started");

  const token = await getToken();

  const orders = await Order.find({
    awbCode: { $exists: true, $ne: "" },
    orderStatus: { $nin: ["delivered", "cancelled"] },
    lastWebhookUpdate: { $lt: new Date(Date.now() - 30 * 60 * 1000) }
  });

  console.log("📦 Backup orders:", orders.length);

  for (let order of orders) {
    try {
      const { data } = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awbCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const track = data?.tracking_data?.shipment_track?.[0];

      const statusRaw =
        track?.current_status ||
        data?.tracking_data?.shipment_track_activities?.slice(-1)?.[0]?.["sr-status-label"];

      if (!statusRaw) continue;

      const status = statusRaw.toUpperCase().replace(/\s+/g, "_");

      order.trackingStatus = status;
      order.shiprocketStatus = status;   // ✅ ADD THIS
      order.lastCronAt = new Date();

      if (status.includes("DELIVERED")) {
        order.orderStatus = "delivered";
        order.deliveredAt = new Date();
      }

      if (status.includes("TRANSIT") || status.includes("OUT") || status.includes("PICK")) {
        order.orderStatus = "shipped";
      }

      if (status.includes("RTO")) {
        order.orderStatus = "cancelled";
      }

      await order.save();

      console.log("✔ Fixed order:", order._id, status);

    } catch (err) {
      console.log("❌ Cron fix error:", order._id, err.message);
    }
  }
});