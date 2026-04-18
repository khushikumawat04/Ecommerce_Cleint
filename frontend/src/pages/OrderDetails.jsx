import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/orderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <h4 className="text-center mt-5">Loading...</h4>;

  return (
    <div className="main-bg">
      <Navbar />

      <div className="container py-5">

        <h2 className="section-title mb-4">
          Order #{order._id.slice(-6)}
        </h2>

        {/* 🟢 TRACKING */}
      <div className="tracking-card mb-4">
  <h5>Order Status</h5>

  {order.orderStatus === "cancelled" ? (
    <div className="text-center text-danger">
      <h5>❌ Order Cancelled</h5>

      <p>
        Cancelled on{" "}
        {new Date(order.cancelledAt).toLocaleString("en-IN")}
      </p>

      <p><strong>Reason:</strong> {order.cancelReason}</p>
    </div>
  ) : (
    <div className="timeline">

      <div className={`step ${order.orderStatus === "created" ? "active" : ""}`}>
        <i className="fas fa-receipt"></i>
        <p>Created</p>
      </div>

      <div className={`step ${["confirmed","shipped","delivered"].includes(order.orderStatus) ? "active" : ""}`}>
        <i className="fas fa-check-circle"></i>
        <p>Confirmed</p>
      </div>

      <div className={`step ${["shipped","delivered"].includes(order.orderStatus) ? "active" : ""}`}>
        <i className="fas fa-truck"></i>
        <p>Shipped</p>
      </div>

      <div className={`step ${order.orderStatus === "delivered" ? "active" : ""}`}>
        <i className="fas fa-box"></i>
        <p>Delivered</p>
      </div>

    </div>
  )}
</div>

        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">
<p className="text-muted">
  Placed on{" "}
  {new Date(order.createdAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}
</p>
            {/* ITEMS */}
          <div className="card p-3 mb-3 shadow-sm border-0">
  <h5>Items</h5>

  {order.items.map((item, i) => (
    <div key={i} className="d-flex align-items-center justify-content-between border-bottom py-2">

      <div className="d-flex align-items-center">

        <img
          src={item.image || "/no-image.png"}
          alt={item.name}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            borderRadius: "10px",
            marginRight: "12px",
            border: "1px solid #eee"
          }}
        />

        <div>
          <p className="mb-1 fw-semibold">{item.name}</p>
          <small className="text-muted">Qty: {item.quantity}</small>
        </div>

      </div>

      <div>
        <strong>₹{item.price * item.quantity}</strong>
      </div>

    </div>
  ))}
</div>

            {/* ADDRESS */}
            <div className="card p-3 shadow-sm border-0">
              <h5>Delivery Address</h5>

              <p>{order.address.name}</p>
              <p>{order.address.houseNo}, {order.address.addressLine}</p>
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              <p>📞 {order.address.phone}</p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="col-md-4">

            <div className="card p-3 shadow-sm border-0">

              <h5>Summary</h5>

              <div className="d-flex justify-content-between">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Payment</span>
               <span className={`badge ${
  order.paymentStatus === "paid" ? "bg-success" : "bg-warning"
}`}>
  {order.paymentStatus}
</span>
              </div>

              <div className="mt-2">
                <small>Method: {order.paymentMethod}</small>
              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default OrderDetails;