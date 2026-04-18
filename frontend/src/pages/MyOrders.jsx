import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/myorders.css";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
const [cancelData, setCancelData] = useState({
  orderId: null,
  reason: "",
  customReason: ""
});
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setOrders(res.data.orders);

    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = async () => {
  const finalReason =
    cancelData.reason === "Other"
      ? cancelData.customReason
      : cancelData.reason;

  if (!finalReason) {
    return alert("Please select a reason");
  }

  try {
    await axios.put(
      `${baseURL}/api/orders/cancel/${cancelData.orderId}`,
      { reason: finalReason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    toast.success("Order cancelled successfully ❌");

    setCancelData({ orderId: null, reason: "", customReason: "" });
    fetchOrders();

  } catch (err) {
    toast.error(err.response?.data?.message || "Cancel failed");
  }
};

  return (
    <div className="main-bg">
      <Navbar />

      <div className="container py-5">
        <h2 className="section-title mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h5>No orders yet 🛒</h5>
          </div>
        ) : (
          <div className="row">

            {orders.map(order => (
              <div key={order._id} className="col-md-6 mb-4">

                <div className="order-card">

                  {/* HEADER */}
                <div className="order-header d-flex justify-content-between align-items-center">

<div>
  <span>Order #{order._id.slice(-6)}</span>
  <br />
  <small className="text-muted">
    {new Date(order.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).replace(",", "")}
  </small>
</div>

  <span className={`status ${order.orderStatus}`}>
    {order.orderStatus}
  </span>

</div>

                  {/* ITEMS */}
                 <div className="order-items">
  {order.items.map((item, i) => (
    <div key={i} className="d-flex align-items-center justify-content-between border-bottom py-2">

      {/* LEFT: IMAGE + NAME */}
      <div className="d-flex align-items-center">

        <img
          src={item?.image || "/no-image.png"}
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

      {/* RIGHT: PRICE (optional if you have it) */}
      <div className="text-end">
        {item.price && (
          <p className="mb-0 fw-bold">₹{item.price * item.quantity}</p>
        )}
      </div>

    </div>
  ))}
</div>

                  {/* FOOTER */}
                  <div className="order-footer">
                    <div>
                      <small>Total</small>
                      <h6>₹{order.totalAmount}</h6>
                    </div>

                    <div>
                      <small>Payment</small>
                      <h6 className={
                        order.paymentStatus === "paid"
                          ? "paid"
                          : "pending"
                      }>
                        {order.paymentStatus}
                      </h6>
                    </div>
                    

                  </div>
<Link to={`/order/${order._id}`} className="btn btn-outline-green mt-2">
  View Details
</Link>
{order.orderStatus !== "cancelled" &&
 order.orderStatus !== "delivered" && (
  <button
    className="btn btn-outline-danger mt-2 ms-2"
    onClick={() =>
      setCancelData({ orderId: order._id, reason: "", customReason: "" })
    }
  >
    Cancel Order ❌
  </button>
)}
{cancelData.orderId === order._id && (
  <div className="card p-3 mt-3 border-danger">

    <h6>Why are you cancelling?</h6>

    <select
      className="form-control mb-2"
      value={cancelData.reason}
      onChange={(e) =>
        setCancelData({ ...cancelData, reason: e.target.value })
      }
    >
      <option value="">Select reason</option>
      <option value="Changed my mind">Changed my mind</option>
      <option value="Ordered by mistake">Ordered by mistake</option>
      <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
      <option value="Delivery is too slow">Delivery is too slow</option>
      <option value="Wrong address selected">Wrong address selected</option>
      <option value="Other">Other</option>
    </select>

    {/* 👉 Show input if Other selected */}
    {cancelData.reason === "Other" && (
      <input
        type="text"
        placeholder="Enter your reason"
        className="form-control mb-2"
        value={cancelData.customReason}
        onChange={(e) =>
          setCancelData({ ...cancelData, customReason: e.target.value })
        }
      />
    )}

    <div className="d-flex gap-2">
      <button
        className="btn btn-danger"
        onClick={() => handleCancel()}
      >
        Confirm Cancel
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => setCancelData({ orderId: null, reason: "", customReason: "" })}
      >
        Close
      </button>
    </div>

  </div>
)}
{/* {order.trackingId && (
  <p>Tracking ID: {order.trackingId}</p>
)} */}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyOrders;