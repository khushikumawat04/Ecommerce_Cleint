import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/signup.css";  

function Signup() {
  const [form, setForm] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/auth/register`, form);
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // 🔥 Google signup/login
  const handleGoogleSignup = () => {
    window.location.href = `${baseURL}/api/auth/google`;
  };

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-container">
        <div className="signup-card">

          <h2 className="signup-title">🌿 Create Account</h2>
          <p className="signup-subtitle">
            Join us for a healthier herbal lifestyle
          </p>

          <input
            className="signup-input"
            placeholder="Full Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="signup-input"
            placeholder="Email Address"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="signup-input"
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button className="signup-btn" onClick={handleSignup}>
            Create Account
          </button>

          {/* Divider */}
          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <span>OR</span>
          </div>

          {/* Google Signup */}
          <button
            className="google-btn"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Signup;