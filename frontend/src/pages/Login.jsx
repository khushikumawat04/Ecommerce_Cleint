import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/login.css";

function Login() {
  const [form, setForm] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
    const baseURL = process.env.REACT_APP_API_URL;
    const query = new URLSearchParams(location.search);
const redirect = query.get("redirect");
  const handleLogin = async () => {
    const res = await axios.post(
      `${baseURL}/api/auth/login`,
      form
    );
     login(res.data);
  if (res.data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate(redirect ? `/${redirect}` : "/");
  }
   


    // navigate("/checkout");
  };

  return (
   <div>
   
   <div className="login-page">
  <Navbar />

  <div className="login-container">
    <div className="login-card">
      
      <h2 className="login-title">Welcome Back 🌿</h2>
      <p className="login-subtitle">Login to continue your herbal journey</p>

      <input
        className="login-input"
        placeholder="Email Address"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      <button
  className="google-btn"
  onClick={() => {
    window.location.href = `${baseURL}/api/auth/google`;
  }}
>
  Continue with Google
</button>

      <p className="signup-text">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>

    </div>
  </div>

  <Footer />
</div>
  
    </div>
  );
}

export default Login;