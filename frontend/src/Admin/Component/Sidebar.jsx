import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "var(--primary-green)",
      color: "white",
      padding: "20px",
      position: "fixed"
    }}>
      <h3>🛒 Admin Panel</h3>

      <hr />

      <Link to="/admin" style={linkStyle}>📊 Dashboard</Link>
      <Link to="/admin/products" style={linkStyle}>📦 All Products</Link>
      <Link to="/admin/orders" style={linkStyle}>📦 Manage Orders</Link>
        <Link to="/admin/offers" style={linkStyle}>🎁 Manage Offers</Link>
    </div>
  );
}

const linkStyle = {
  display: "block",
  color: "white",
  textDecoration: "none",
  margin: "10px 0",
  padding: "8px",
  borderRadius: "5px",
  background: "rgba(255,255,255,0.1)"
};