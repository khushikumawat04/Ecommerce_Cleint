const cron = require("node-cron");
const Order = require("../models/Orders");

// Every 5 minutes
cron.schedule("*/60 * * * *", async () => {

  try {

    console.log("🧹 Running cleanup cron...");

    const result = await Order.updateMany(

      {
        paymentMethod: "ONLINE",

        paymentStatus: "pending",

        orderStatus: "pending",

        createdAt: {
          $lt: new Date(Date.now() - 30 * 60 * 1000)
        }
      },

      {
        paymentStatus: "failed",

        orderStatus: "cancelled",

        cancelledReason: "Payment timeout"
      }

    );

    console.log(
      `✅ Cleaned ${result.modifiedCount} abandoned orders`
    );

  } catch (err) {

    console.log("❌ Cron error:", err.message);

  }

});