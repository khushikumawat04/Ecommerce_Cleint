import { Link, useNavigate } from "react-router-dom";
import "../styles/theme.css";
import "../styles/navbar.css";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


function Navbar({ onSearch }) {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
    const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [showProducts, setShowProducts] = useState(false);

  const [search, setSearch] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [menuOpen, setMenuOpen] = useState(false);
   const baseURL = process.env.REACT_APP_API_URL;

const handleSearch = (e) => {
  const value = e.target.value;
  setSearch(value);

  onSearch(value); // send to Home

  if (value.length > 0) {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // top 5
  } else {
    setSuggestions([]);
  }
}; 
  // ✅ Close dropdown on outside click
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!dropdownRef.current) return;
    if (!dropdownRef.current.contains(e.target)) {
      setOpen(false);
      setShowProducts(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  // ✅ Fetch products
  axios.get(`${baseURL}/api/products`)
    .then(res => {
      setProducts(res.data.data);
    })
    .catch(err => console.log(err));

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* UPPER NAVBAR */}
     <div className="upper-navbar">
  <div className="upper-container">

    {/* LEFT SIDE - SOCIAL LINKS */}
    <div className="upper-left">
      {/* Call */}
      <a href="tel:+919999999999" className="icon">
        <i className="fas fa-phone"></i>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Facebook */}
      <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <i className="fab fa-facebook-f"></i>
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <i className="fab fa-instagram"></i>
      </a>
    </div>


    {/* RIGHT SIDE */}
    <div className="upper-right">

      {/* USER DROPDOWN */}
      {user ? (
        <div className="user-dropdown" ref={dropdownRef}>
          <div
            className="user-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <i className="fas fa-user"></i>
            <span>{user?.name || "User"}</span>
            <i className={`fas fa-chevron-down ${open ? "rotate" : ""}`}></i>
          </div>

          <div className={`dropdown-menu ${open ? "show" : ""}`}>
            <Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
            <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>

            <div className="dropdown-divider"></div>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Signup</Link>
        </div>
      )}
    </div>
  </div>
</div>

      {/* MAIN NAVBAR */}
      <nav className="beast-navbar">
        {/* LOGO */}
        <div className="beast-logo">
          <Link to="/" className="logo-text">
            <img
              src="https://res.cloudinary.com/dj8yfrchq/image/upload/v1775118830/2_1_slbxmj.png"
              alt="Karmaas Logo"
              height={200} width={200}
            />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="search-container">
        <input
  type="text"
  className="search-input"
  placeholder="Search products..."
  value={search}
  onChange={handleSearch}
/>
       
          {/* 🔽 DROPDOWN */}
  {suggestions.length > 0 && (
    <div className="search-dropdown">
      {suggestions.map(item => (
        <div
          key={item._id}
          className="search-item"
          onClick={() => {
            setSearch(item.name);
            onSearch(item.name);
            setSuggestions([]);
          }}
        >
          {item.name}
        </div>
      ))}
      
    </div>
  )}
 </div>
<div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  <i className="fas fa-bars"></i>
</div>
        {/* RIGHT SIDE */}
       <div className={`navbar-right ${menuOpen ? "active" : ""}`}>
  
   <Link to="/about-us" className="nav-link">
    About Us
  </Link>

  <div
    className="nav-link products-menu"
    onMouseEnter={() => setShowProducts(true)}
    onMouseLeave={() => setShowProducts(false)}
  >
    Products

    {showProducts && (
      <div className="products-dropdown">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => {
              navigate(`/product/${product._id}`);
              setMenuOpen(false); // ✅ close on click
            }}
          >
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
            />
            <p>{product.name}</p>
          </div>
        ))}
      </div>
    )}
  </div>

  <Link to="/track" className="nav-link">
    Track Order
  </Link>
   <Link to="/contact" className="nav-link">
    Contact Us
  </Link>

</div>

<div className="cart-mobile">
  <Link to="/cart" className="cart-icon-wrapper">
    <i className="fas fa-shopping-cart cart-icon"></i>

    {cartItems.length > 0 && (
      <span className="cart-badge">
        {cartItems.length}
      </span>
    )}
  </Link>
</div>
      </nav>
    </>
  );
}

export default Navbar;