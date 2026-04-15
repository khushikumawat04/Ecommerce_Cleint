import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);
const fetchOrders = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/admin/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    console.log("ORDERS API:", res.data); // 👈 ADD THIS

    setOrders(res.data.orders);
  } catch (err) {
    console.error("FETCH ERROR:", err.response?.data || err.message);
  }
};

  const updateStatus = async (id, status) => {
    await axios.put(
      `${baseURL}/api/admin/order/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    fetchOrders();
  };

  const shipOrder = async (id) => {
  try {
    await axios.post(
      `${baseURL}/api/admin/ship/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("Order shipped 🚚");
    fetchOrders();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <> <Navbar/>
    <div className="admin-container">
     

      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="table-responsive">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order._id}>

                <td>{order._id.slice(-6)}</td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <span className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>

                <td>{order.paymentStatus}</td>

              <td>

  {/* STATUS CHANGE */}
  <select
    onChange={(e) => updateStatus(order._id, e.target.value)}
    value={order.orderStatus}
  >
    <option value="created">Created</option>
    <option value="confirmed">Confirmed</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
  </select>

  {/* VIEW DETAILS */}
  <button
    className="btn btn-sm btn-outline-green ms-2"
    onClick={() => setSelectedOrder(order)}
  >
    👁 View
  </button>

  {/* SHIP BUTTON */}
  <button
    className="btn btn-sm btn-green ms-2"
    onClick={() => shipOrder(order._id)}
  >
    🚚 Ship
  </button>

</td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>

    {selectedOrder && (
  <div className="modal-overlay">

    <div className="modal-box">

      <h4>Order Details</h4>

      <p><strong>ID:</strong> {selectedOrder._id}</p>
      <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
      <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
      <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>

      <hr />

      <h5>Items</h5>
      {selectedOrder.items.map((item, i) => (
        <div key={i} className="order-item">
          {item.name} × {item.quantity}
        </div>
      ))}

      <hr />

      <h5>Address</h5>
      <p>{selectedOrder.address.name}</p>
      <p>{selectedOrder.address.houseNo}, {selectedOrder.address.addressLine}</p>
      <p>{selectedOrder.address.city}</p>
      <p>{selectedOrder.address.phone}</p>

      <button
        className="btn btn-danger mt-3"
        onClick={() => setSelectedOrder(null)}
      >
        Close ❌
      </button>

    </div>
  </div>
)}
    <Footer/>
    </>
  );
}

export default AdminDashboard;