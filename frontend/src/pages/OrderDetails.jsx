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
          <div className="timeline">

            <div className={`step ${order.orderStatus !== "created" ? "active" : ""}`}>
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
        </div>

        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">

            {/* ITEMS */}
            <div className="card p-3 mb-3 shadow-sm border-0">
              <h5>Items</h5>

              {order.items.map((item, i) => (
                <div key={i} className="item-row">
                  <span>{item.name}</span>
                  <span>{item.quantity} × ₹{item.price}</span>
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
                <span className={
                  order.paymentStatus === "paid" ? "paid" : "pending"
                }>
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