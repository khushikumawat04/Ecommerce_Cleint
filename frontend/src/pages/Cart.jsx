import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import { Link } from "react-router-dom";  
import { useNavigate } from "react-router-dom"; 

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } =
    useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
   

    if (!user) {
      // ❌ Not logged in → redirect to login
    navigate("/login?redirect=checkout");
    // navigate("/login");
    } else {
      console.log("User is logged in, proceeding to checkout"); // Debugging line
      // ✅ Logged in → go to checkout
      navigate("/checkout");
    }
  };
  return (
    <div className="main-bg">

      <Navbar />

      <div className="container py-5">
        <h2 className="section-title mb-4">Shopping Cart 🛒</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h5>Your cart is empty 🛒</h5>
          </div>
        ) : (
          <div className="row">

            {/* LEFT SIDE */}
            <div className="col-lg-8">

              {cartItems.map((item) => (
                <div key={item._id} className="cart-card">

                  <div className="row align-items-center">

                    {/* IMAGE */}
                    <div className="col-md-3 text-center">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="cart-img"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="col-md-6">

                      <h6 className="fw-bold">{item.name}</h6>

                      <p className="price">₹{item.price}</p>

                      {/* QUANTITY */}
                      <div className="qty-box">

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span className="qty-value">
                          {item.quantity}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>

                      </div>

                      <small className="stock-in">In Stock</small>

                    </div>

                    {/* RIGHT */}
                    <div className="col-md-3 text-center">

                      <h6 className="fw-bold">
                        ₹{item.price * item.quantity}
                      </h6>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="col-lg-4">

              <div className="summary-card">

                <h5 className="fw-bold mb-3">Price Details</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Price</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span className="text-success">Free</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>

              <button
                className="btn btn-green w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              </div>

            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;