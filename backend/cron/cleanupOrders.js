const cron = require("node-cron");
const Order = require("../models/Orders");

// Runs every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("🧹 Running cleanup cron job...");

    const result = await Order.updateMany(
      {
        paymentStatus: "pending",
        orderStatus: "pending",
        createdAt: {
        $lt: new Date(Date.now() - 5 * 60 * 1000)
        }
      },
      {
        paymentStatus: "failed",
        orderStatus: "cancelled"
      }
    );

    console.log("✅ Cleanup done:", result.modifiedCount);

  } catch (err) {
    console.log("❌ Cron error:", err.message);
  }
});