import { Link } from "react-router-dom";
import axios from "axios";
import { useState ,useEffect} from "react";

export default function Sidebar() {

  // Example user data
  // Replace with actual logged-in admin data
  const baseURL=process.env.REACT_APP_API_URL;
  const [user,setUser] = useState(null);


      const fetchProfile = async () => {
    const res = await axios.get(`${baseURL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUser(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

   

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "var(--primary-green)",
        color: "white",
        padding: "20px",
        position: "fixed",
        overflowY: "auto"
      }}
    >

      {/* PROFILE SECTION */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
          padding: "15px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px"
        }}
      >

        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "white",
            color: "var(--primary-green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 auto 10px"
          }}
        >
          {user?.name.charAt(0) || "Admin"}
        </div>

        <h6 style={{ margin: "5px 0" }}>
          {user?.name || "Loading"}
        </h6>

        <p
          style={{
            fontSize: "13px",
            margin: "4px 0",
            opacity: 0.9
          }}
        >
          {user?.email || "Loading"}
        </p>

        <span
          style={{
            fontSize: "12px",
            background: "#ffffff22",
            padding: "4px 10px",
            borderRadius: "20px"
          }}
        >
          {user?.role || "Admin"}
        </span>

      </div>


      <h3>🛒 Admin Panel</h3>

      <hr />


      {/* SIDEBAR LINKS */}
      <Link to="/admin" style={linkStyle}>
        📊 Dashboard
      </Link>

      <Link to="/admin/products" style={linkStyle}>
        📦 All Products
      </Link>

      <Link to="/admin/orders" style={linkStyle}>
        📦 Manage Orders
      </Link>

      <Link to="/admin/offers" style={linkStyle}>
        🎁 Manage Offers
      </Link>

      {/* <Link to="/admin/profile" style={linkStyle}>
        👤 My Profile
      </Link> */}

      <Link to="/admin/chnage-passowrd" style={linkStyle}>
        🔐 Change Password
      </Link>

    </div>
  );
}

const linkStyle = {
  display: "block",
  color: "white",
  textDecoration: "none",
  margin: "10px 0",
  padding: "10px",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.1)",
  transition: "0.3s"
};