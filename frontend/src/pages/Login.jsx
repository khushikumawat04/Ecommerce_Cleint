import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/login.css";

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const baseURL = process.env.REACT_APP_API_URL;

  const query = new URLSearchParams(location.search);
  const redirect = query.get("redirect");

  const validateForm = () => {

    if (!form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };


  const handleLogin = async () => {

    setError("");

    if (!validateForm()) return;

    try {

      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        {
          email: form.email.trim().toLowerCase(),
          password: form.password
        }
      );

      login(res.data);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(
          redirect ? `/${redirect}` : "/"
        );
      }

    } catch (err) {

      const msg = err?.response?.data?.message;

      if (msg) {
        setError(msg);
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again.");
      } else {
        setError("Unable to login right now.");
      }

    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/api/auth/google`;
  };


  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="login-card">

          <h2 className="login-title">
            Welcome Back 🌿
          </h2>

          <p className="login-subtitle">
            Login to continue your herbal journey
          </p>


          {error && (
            <div
              style={{
                background:"#fff3f3",
                color:"#d32f2f",
                padding:"12px",
                borderRadius:"8px",
                marginBottom:"15px",
                fontWeight:"500"
              }}
            >
              {error}
            </div>
          )}


          <input
            className="login-input"
            placeholder="Email Address"
            value={form.email}
            onChange={(e)=> {
              setError("");
              setForm({
                ...form,
                email:e.target.value
              });
            }}
          />


          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=> {
              setError("");
              setForm({
                ...form,
                password:e.target.value
              });
            }}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                handleLogin();
              }
            }}
          />


          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {
              loading
                ? "Logging in..."
                : "Login"
            }
          </button>


          <div className="divider">
            <span>OR</span>
          </div>


          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continue with Google
          </button>


          <p className="signup-text">
            Don’t have an account?
            <Link to="/signup">
              {" "}Sign up
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;