import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";

export default function Dashboard() {

    const baseURL=process.env.REACT_APP_API_URL;

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    // console.log("Fetching dashboard stats with token:", token);
    try {
      // Products count

const productsRes=await axios.get(
`${baseURL}/api/admin/products`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

      // Orders count (if API exists)
      const ordersRes = await axios.get(
        `${baseURL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      
      const usersRes = await axios.get(
        `${baseURL}/api/admin/users-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data?.orders?.length || 0,
        revenue: 45000, // temporary (later from backend orders sum)
        users: usersRes.data.totalUsers // optional static for now
      });

    } catch (error) {
      console.log("Dashboard error:", error.message);
    }
  };

  return (
    <AdminLayout>

      <h2 style={{ marginBottom: "20px" }}>📊 Dashboard Overview</h2>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px"
      }}>

        <div style={cardStyle("#00C853")}>
          <h2>{stats.products}</h2>
          <p>📦 Products</p>
        </div>

        <div style={cardStyle("#2196F3")}>
          <h2>{stats.orders}</h2>
          <p>🧾 Orders</p>
        </div>

        {/* <div style={cardStyle("#FFC107")}>
          <h2>₹{stats.revenue}</h2>
          <p>💰 Revenue</p>
        </div> */}

        <div style={cardStyle("#9C27B0")}>
          <h2>{stats.users}</h2>
          <p>👤 Users</p>
        </div>

      </div>

      {/* QUICK INFO SECTION */}
      {/* <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f5f5f5",
        borderRadius: "10px"
      }}>
        <h3>⚡ Quick Actions</h3>

        <button className="btn btn-success m-2">
          ➕ Add Product
        </button>

        <button className="btn btn-primary m-2">
          📦 View Products
        </button>

        <button className="btn btn-warning m-2">
          🧾 Manage Orders
        </button>

      </div> */}

    </AdminLayout>
  );
}

// CARD STYLE
const cardStyle = (color) => ({
  background: color,
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
});