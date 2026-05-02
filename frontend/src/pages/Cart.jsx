import { useContext,useState,useEffect } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import { Link } from "react-router-dom";  
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-toastify";
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } =
    useContext(CartContext);

    // coupon states
    const [couponCode, setCouponCode] = useState("");
const [discount, setDiscount] = useState(0);
const [finalTotal, setFinalTotal] = useState(cartTotal);
const [appliedOffer, setAppliedOffer] = useState(null);
// const [extraDiscount,setExtraDiscount] = useState(0);
// const [bogoMessage,setBogoMessage] = useState("");
// const [bogoOffers,setBogoOffers] = useState({});
// const [bogoDiscount,setBogoDiscount] = useState(0);
const [appliedOfferType,setAppliedOfferType] = useState(null);
const [offerRemoved, setOfferRemoved] = useState(false);
const [bogoDetails, setBogoDetails] = useState([]);
// values: "coupon" | "auto" | "bogo" | null
const baseURL = process.env.REACT_APP_API_URL;


  const navigate = useNavigate();

const applyCoupon = async () => {

if(appliedOfferType){
toast.error("Only one offer allowed ❌");
return;
}

await applyBestOffer(couponCode);

if(!couponCode){
toast.error("Enter coupon code");
}
};
const applyBestOffer = async (manualCoupon = "") => {
  try {
    const res = await axios.post(
      `${baseURL}/api/offers/apply-best-offer`,
      {
        cartItems,
        cartTotal,
        couponCode: manualCoupon || couponCode
      }
    );
     // 👉 ADD HERE
    // console.log("API RESPONSE:", res.data);


    if (res.data.success) {
      // ✅ APPLY OFFER
      setDiscount(res.data.discount);
      setFinalTotal(res.data.finalTotal);
      setAppliedOfferType(res.data.type);

      localStorage.setItem("finalDiscount", res.data.discount);
      localStorage.setItem("finalOfferType", res.data.type);
      localStorage.setItem("finalTotal", res.data.finalTotal);

        if (res.data.type === "bogo") {
    setBogoDetails(res.data.bogoDetails || []);
  } else {
    setBogoDetails([]);
  }

    } else {
      // ❗ IMPORTANT: REMOVE INVALID OFFER
      setDiscount(0);
      setFinalTotal(cartTotal);
      setAppliedOfferType(null);
        setBogoDetails([]); // ✅ ADD THIS

      localStorage.removeItem("finalDiscount");
      localStorage.removeItem("finalOfferType");
      localStorage.removeItem("finalTotal");

      // optional toast (avoid spam)
      console.log("Offer removed: ", res.data.message);
    }

  } catch (err) {
    console.log(err);
  }
};


useEffect(() => {
  applyBestOffer();
   setBogoDetails([]); // reset before new API call
  // alert("price chnage");
}, [cartItems, cartTotal]);

const clearOffer = () => {
  localStorage.removeItem("finalDiscount");
  localStorage.removeItem("finalOfferType");
  localStorage.removeItem("finalTotal");

  setDiscount(0);
  setFinalTotal(cartTotal);
  setAppliedOfferType(null);
  setCouponCode("");
  setOfferRemoved(true); // ✅ prevent auto apply

  toast.success("Offer removed ✅");
};
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

              {cartItems.map((item) =>{
                 const bogoItem = bogoDetails.find(
  b => String(b.productId) === String(item._id)
);;
  

              return (
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


          {/* ✅ BOGO MESSAGE */}
        {bogoItem && bogoItem.freeItems > 0 && (
  <p className="text-success small mb-1 mx-4">
     🎁 Buy {bogoItem.buyQty} Get {bogoItem.freeQty} Free  
    ({bogoItem.freeItems} free)
  </p>
)}

                      </div>

                      <small className="stock-in">In Stock</small>

                    </div>

                    {/* RIGHT */}
                    <div className="col-md-3 text-center">

                      <h6 className="fw-bold">
                        {/* ₹{item.price * item.quantity} */}
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
              )}) }

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


                {/* Coupon */}
                {/* Coupon Box */}
<div className="mb-3 mt-3">

<h6>Apply Coupon</h6>

<div className="d-flex gap-2">
<input
type="text"
className="form-control"
placeholder="Enter Coupon Code"
value={couponCode}
onChange={(e)=>setCouponCode(e.target.value)}
/>

<button
className="btn btn-dark"
onClick={applyCoupon}
>
Apply
</button>


</div>

</div>

                <hr />

              <div className="summary-box mt-3 p-3 rounded shadow-sm bg-white">

<h5 className="fw-bold mb-3 border-bottom pb-2">
Price Details
</h5>

<div className="price-row">
<span>Subtotal</span>
<span>₹{cartTotal}</span>
</div>



{discount > 0 && (
<div className="price-row text-success">
<span>Discount ({appliedOfferType})</span>
<span>-₹{discount}</span>
</div>
)}

{appliedOfferType && (
<div className="alert alert-info mt-2">
Applied Offer: <b>{appliedOfferType}</b>
</div>
)}

{/* Remove offer button */}
{appliedOfferType && (
<button
className="btn btn-sm btn-danger mt-2"
onClick={clearOffer}
>
Remove Offer ❌
</button>
)}

<hr/>

<div className="price-row total-row">
<span>Total Payable</span>

<span>
₹{finalTotal || cartTotal}
</span>
</div>

<p className="text-success small mt-2 mb-0">
You saved ₹
{discount }
</p>

</div>
<br/>
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


