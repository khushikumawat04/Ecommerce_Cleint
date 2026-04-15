import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/myorders.css";
import {Link} from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);

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
                  <div className="order-header">
                    <span>Order #{order._id.slice(-6)}</span>
                    <span className={`status ${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="item-row">
                        <span>{item.name}</span>
                        <span>x {item.quantity}</span>
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

{order.trackingId && (
  <p>Tracking ID: {order.trackingId}</p>
)}
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