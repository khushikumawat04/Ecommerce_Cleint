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
const [extraDiscount,setExtraDiscount] = useState(0);
const [bogoMessage,setBogoMessage] = useState("");
const [bogoOffers,setBogoOffers] = useState({});
const [bogoDiscount,setBogoDiscount] = useState(0);
const baseURL = process.env.REACT_APP_API_URL;


  const navigate = useNavigate();
 const fetchAutoOffers = async () => {
try{

const res = await axios.get(
`${baseURL}/api/offers`
);

const offers = res.data.offers || [];

let autoDiscount = 0;
let totalBogoSavings = 0;
let bogoText = "";
let bogoMap = {};

offers.forEach(offer => {

if(
offer.type==="auto_discount" &&
cartTotal >= offer.minOrderValue
){
autoDiscount =
(cartTotal * offer.discountPercent)/100;
}

if(offer.type==="bogo"){

const productInCart =
cartItems.find(
item => item._id === offer.productId?._id
);

if(
productInCart &&
productInCart.quantity >= offer.buyQty
){

const freeItems =
Math.floor(
productInCart.quantity / offer.buyQty
) * offer.freeQty;

totalBogoSavings +=
freeItems * productInCart.price;

bogoMap[productInCart._id]={
buyQty:offer.buyQty,
freeQty:offer.freeQty,
freeItems
};

bogoText =
`Buy ${offer.buyQty} Get ${offer.freeQty} Applied 🎁`;

}

}
});

setExtraDiscount(autoDiscount);
setBogoOffers(bogoMap);
setBogoDiscount(totalBogoSavings);
localStorage.setItem(
"autoDiscount",
String(autoDiscount)
);

localStorage.setItem(
"bogoDiscount",
String(totalBogoSavings)
);

setBogoMessage(bogoText);

}catch(err){
console.log(err);
}
};
  const applyCoupon = async () => {
try {

const res = await axios.post(
`${baseURL}/api/offers/apply-coupon`,
{
code: couponCode,
cartTotal
}
);
console.log("Coupon Response:", res.data);
if(res.data.success){

const discountAmount =
cartTotal - res.data.finalTotal;

setDiscount(discountAmount);
setFinalTotal(res.data.finalTotal);
setAppliedOffer(res.data.offer);

// save for checkout page
localStorage.setItem(
"appliedCoupon",
JSON.stringify({
code: couponCode
})
);

localStorage.setItem(
"discount",
String(discountAmount)
);



toast.success("Coupon Applied");
}
else{
alert("Invalid Coupon");
}

} catch(err){
console.log(err);
alert("Coupon failed");
}
};



useEffect(()=>{

setFinalTotal(
cartTotal-discount-extraDiscount
);
// localStorage.removeItem("appliedCoupon");
// localStorage.removeItem("discount");

fetchAutoOffers();

},[
cartTotal,
discount,
cartItems
]);

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
{bogoOffers[item._id] && (
<p className="text-success fw-bold mt-2">
🎁 {bogoOffers[item._id].freeItems} Free Item Added
</p>
)}
                      <small className="stock-in">In Stock</small>

                    </div>

                    {/* RIGHT */}
                    <div className="col-md-3 text-center">

                      <h6 className="fw-bold">
                        {/* ₹{item.price * item.quantity} */}
           ₹{
item.price *
(
item.quantity -
(bogoOffers[item._id]?.freeItems || 0)
)
}
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
<span>Coupon Discount</span>
<span>-₹{discount}</span>
</div>
)}

{extraDiscount > 0 && (
<div className="price-row text-primary">
<span>Auto Offer</span>
<span>-₹{extraDiscount}</span>
</div>
)}

{bogoDiscount > 0 && (
<div className="price-row text-success fw-semibold">
<span>🎁 BOGO Savings</span>
<span>-₹{bogoDiscount}</span>
</div>
)}

{bogoMessage && (
<div className="alert alert-success py-2 mt-3 mb-3 small">
{bogoMessage}
</div>
)}

<hr/>

<div className="price-row total-row">
<span>Total Payable</span>

<span>
₹{
cartTotal
- discount
- extraDiscount
- bogoDiscount
}
</span>
</div>

<p className="text-success small mt-2 mb-0">
You saved ₹
{discount + extraDiscount + bogoDiscount}
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


