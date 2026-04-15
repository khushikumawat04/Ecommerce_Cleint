const Order = require("../models/Orders");
const {createShipment}  = require("../Services/shiprocket");

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

// 🔥 UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
       console.log("Orders with id  api hit");
  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    res.json({
      success: true,
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🚚 SHIP ORDER (REAL)
exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    // 🔥 CALL SHIPROCKET
    const shipment = await createShipment(order);

    console.log("SHIPROCKET RESPONSE:", shipment);

    // ✅ SAVE DETAILS
    order.orderStatus = "shipped";
    order.trackingId = shipment?.shipment_id || "N/A";
    order.courier = shipment?.courier_name || "Shiprocket";

    await order.save();

    res.json({
      success: true,
      message: "Shipment created 🚚",
      shipment
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
// 🧱 STEP 5: UPDATE ORDER