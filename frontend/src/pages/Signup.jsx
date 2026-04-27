import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/signup.css";

function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  // Validate form
  const validateForm = () => {

    if (!form.name || !form.email || !form.password) {
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


  const handleSignup = async () => {

    setError("");

    if (!validateForm()) return;

    try {

      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/auth/register`,
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password
        }
      );

      login(res.data);
      navigate("/");

    } catch (err) {

      const msg = err.response?.data?.message;

      if (msg) {
        setError(msg);
      } else {
        setError("Signup failed. Try again.");
      }

    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignup = () => {
    window.location.href = `${baseURL}/api/auth/google`;
  };


  return (
    <div className="signup-page">

      <Navbar />

      <div className="signup-container">
        <div className="signup-card">

          <h2 className="signup-title">
            🌿 Create Account
          </h2>

          <p className="signup-subtitle">
            Join us for a healthier herbal lifestyle
          </p>


          {error && (
            <div
              style={{
                background:"#fff0f0",
                color:"#d32f2f",
                padding:"10px",
                borderRadius:"8px",
                marginBottom:"10px"
              }}
            >
              {error}
            </div>
          )}


          <input
            className="signup-input"
            placeholder="Full Name"
            value={form.name}
            onChange={(e)=>{
              setError("");
              setForm({
                ...form,
                name:e.target.value
              });
            }}
          />


          <input
            className="signup-input"
            placeholder="Email Address"
            value={form.email}
            onChange={(e)=>{
              setError("");
              setForm({
                ...form,
                email:e.target.value
              });
            }}
          />


          <input
            className="signup-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>{
              setError("");
              setForm({
                ...form,
                password:e.target.value
              });
            }}
          />


          <button
            className="signup-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>


          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <span>OR</span>
          </div>


          <button
            className="google-btn"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            Continue with Google
          </button>


          <p className="login-text">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Signup;