import { useState,useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
// import { Toast } from "bootstrap";
import { toast } from "react-toastify";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL;

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");


const [coupon,setCoupon]=useState(()=>{
const saved=localStorage.getItem("appliedCoupon");
return saved ? JSON.parse(saved) : null;
});

const [discount,setDiscount]=useState(()=>{
return Number(localStorage.getItem("discount")) || 0;
});
const [autoDiscount,setAutoDiscount] = useState(()=>{
return Number(
localStorage.getItem("autoDiscount")
) || 0;
});

const [bogoDiscount,setBogoDiscount] = useState(()=>{
return Number(
localStorage.getItem("bogoDiscount")
) || 0;
});
const finalTotal = Math.max(
cartTotal - discount - autoDiscount - bogoDiscount,
0
);
useEffect(()=>{

const savedCoupon=
localStorage.getItem("appliedCoupon");

const savedDiscount=
localStorage.getItem("discount");

const savedAuto=
localStorage.getItem("autoDiscount");

const savedBogo=
localStorage.getItem("bogoDiscount");

if(savedCoupon){
setCoupon(JSON.parse(savedCoupon));
}

if(savedDiscount){
setDiscount(Number(savedDiscount));
}

if(savedAuto){
setAutoDiscount(Number(savedAuto));
}

if(savedBogo){
setBogoDiscount(Number(savedBogo));
}

},[]);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    houseNo: "",
    addressLine: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });

  const fetchAddresses = async () => {
  try {
    const res = await fetch(`${baseURL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    setSavedAddresses(data.addresses || []);
  } catch (err) {
    console.error(err);
  }
};
  // INPUT HANDLE
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // VALIDATION
  const validateAddress = () => {
    if (
      !address.name || !address.phone || !address.houseNo ||
      !address.addressLine || !address.city ||
      !address.state || !address.pincode
    ) {
      return "Please fill all required fields";
    }

    if (address.phone.length !== 10) return "Invalid phone number";
    if (address.pincode.length !== 6) return "Invalid pincode";

    return "";
  };

  // STEP 1 → STEP 2
const handleContinue = async () => {
  const err = validateAddress();
  if (err) return setError(err);

  setError("");

  try {
    // 👉 If address NOT from saved list → save it
    if (!address._id) {
      await saveAddressToDB();
      await fetchAddresses(); // refresh list
    }

    setStep(2);

  } catch (err) {
    console.error(err);
  }
};

  // FINAL ORDER FUNCTION
const handleFinalOrder = async () => {
try {

if(paymentMethod==="COD"){

const res = await fetch(`${baseURL}/api/orders/create`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
items: cartItems.map(item=>({
productId:item._id,
name:item.name,
price:item.price,
quantity:item.quantity,
image:item.images?.[0]?.url
})),
// total:cartTotal,
subtotal: cartTotal,
discount:
discount +
autoDiscount +
bogoDiscount,
total: finalTotal,
couponCode: coupon?.code || null,
address,
paymentMethod:"COD"
})
});

const data=await res.json();

if(data.success){
toast.success("Order placed successfully 🎉");
localStorage.removeItem("appliedCoupon");
localStorage.removeItem("discount");
localStorage.removeItem("autoDiscount");
localStorage.removeItem("bogoDiscount");

setTimeout(()=>{
clearCart();
window.location.href="/";
},2000);
}

}

else{

// ONLY create razorpay order first
const razorRes = await fetch(
`${baseURL}/api/payment/create-order`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
amount: finalTotal * 100 // convert to paise
})
}
);

const razorData = await razorRes.json();

const options={
key:process.env.REACT_APP_RAZORPAY_KEYID,
amount:razorData.amount,
currency:"INR",
order_id:razorData.id,

handler: async function(response){

// verify payment
const verifyRes=await fetch(
`${baseURL}/api/payment/verify`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(response)
}
);

const verifyData=await verifyRes.json();

if(verifyData.success){

// NOW create order only after payment success
const orderRes = await fetch(
`${baseURL}/api/orders/create`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:JSON.stringify({
items: cartItems.map(item=>({
productId:item._id,
name:item.name,
price:item.price,
quantity:item.quantity,
image:item.images?.[0]?.url
})),
// total:cartTotal,a
subtotal: cartTotal,
total: finalTotal,
discount:
discount +
autoDiscount +
bogoDiscount,
couponCode: coupon?.code || null,
address,
paymentMethod:"ONLINE",
paymentStatus:"Paid",
paymentId:response.razorpay_payment_id
})
}
);

const orderData=await orderRes.json();

if(orderData.success){
toast.success("Payment successful 🎉");
localStorage.removeItem("appliedCoupon");
localStorage.removeItem("discount");
localStorage.removeItem("autoDiscount");
localStorage.removeItem("bogoDiscount");

setTimeout(()=>{
clearCart();
window.location.href="/";
},3000);
}

}else{
toast.error("Payment verification failed ❌");
}

},

modal:{
ondismiss:function(){
toast.error("Payment cancelled");
}
}
};

const rzp = new window.Razorpay(options);

// Payment failed event
rzp.on("payment.failed",function(){
toast.error("Payment failed ❌");
});

rzp.open();

}

}catch(err){
console.error(err);
}
};
const saveAddressToDB = async () => {
  try {
    await fetch(`${baseURL}/api/auth/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(address)
    });

    console.log("Address saved ✅");
  } catch (err) {
    console.error("Save failed ❌", err);
  }
};
useEffect(() => {
  fetchAddresses();
}, []);
  return (
    <div className="main-bg">
      <Navbar />

      <div className="container py-5">
        <h2 className="section-title mb-4">Checkout</h2>

        {/* STEP BAR */}
        <div className="stepper mb-4">
          <span className={step >= 1 ? "active" : ""}>Address</span>
          <span className={step >= 2 ? "active" : ""}>Review</span>
          <span className={step >= 3 ? "active" : ""}>Payment</span>
        </div>

        {/* ================= STEP 1 ================= */}
       {step === 1 && (
  <div className="card p-4 shadow-sm border-0">

    <h5 className="mb-3">Saved Addresses</h5>

    <div className="row mb-4">
      {savedAddresses.length > 0 ? (
        savedAddresses.map(addr => (
          <div key={addr._id} className="col-md-6 mb-3">
            <div className="card p-3 border-0 shadow-sm">

              <p><strong>{addr.name}</strong></p>
              <p>{addr.houseNo}, {addr.addressLine}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>📞 {addr.phone}</p>

              <button
                className={`btn mt-2 ${
                  address._id === addr._id
                    ? "btn-success"
                    : "btn-outline-primary"
                }`}
                onClick={() => setAddress(addr)}
              >
                {address._id === addr._id ? "Selected ✅" : "Deliver Here 🚚"}
              </button>

            </div>
          </div>
        ))
      ) : (
        <p>No saved addresses</p>
      )}
    </div>

    <hr />

    <h5>Enter / Edit Address</h5>

    {error && <p className="text-danger">{error}</p>}

    <div className="row">

      <div className="col-md-6 mb-3">
        <input
          name="name"
          value={address.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="form-control"
        />
      </div>

      <div className="col-md-6 mb-3">
        <input
          name="phone"
          value={address.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="form-control"
        />
      </div>

      <div className="col-md-6 mb-3">
        <input
          name="houseNo"
          value={address.houseNo}
          onChange={handleChange}
          placeholder="House No"
          className="form-control"
        />
      </div>

      <div className="col-md-6 mb-3">
        <input
          name="addressLine"
          value={address.addressLine}
          onChange={handleChange}
          placeholder="Street"
          className="form-control"
        />
      </div>

      <div className="col-md-12 mb-3">
        <input
          name="landmark"
          value={address.landmark}
          onChange={handleChange}
          placeholder="Landmark"
          className="form-control"
        />
      </div>

      <div className="col-md-4 mb-3">
        <input
          name="pincode"
          value={address.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="form-control"
        />
      </div>

      <div className="col-md-4 mb-3">
        <input
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="City"
          className="form-control"
        />
      </div>

      <div className="col-md-4 mb-3">
        <input
          name="state"
          value={address.state}
          onChange={handleChange}
          placeholder="State"
          className="form-control"
        />
      </div>

    </div>

    <button className="btn btn-green" onClick={handleContinue}>
      Continue →
    </button>

  </div>
)}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="row">

            <div className="col-md-8">

              <div className="card p-3 shadow-sm border-0">
                <h5>Order Items</h5>

                {cartItems.map(item => (
                  <div key={item._id}
                    className="d-flex justify-content-between border-bottom py-2">
                   <div className="d-flex align-items-center">
      <img
        src={item.images?.[0]?.url}
        alt={item.name}
        style={{
          width: "60px",
          height: "60px",
          objectFit: "cover",
          borderRadius: "8px",
          marginRight: "10px"
        }}
      />

      <div>
        <p className="mb-0">{item.name}</p>
        <small>Qty: {item.quantity}</small>
      </div>
    </div>

    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="card p-3 mt-3 shadow-sm border-0">
                <h5>Delivery Address</h5>

                <p>{address.name}</p>
                <p>{address.houseNo}, {address.addressLine}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>📞 {address.phone}</p>
              </div>

              <button className="btn btn-outline-secondary mt-3 me-2"
                onClick={() => setStep(1)}>
                ← Back
              </button>

              <button className="btn btn-green mt-3"
                onClick={() => setStep(3)}>
                Continue to Payment →
              </button>

            </div>

            <div className="col-md-4">
  <div className="summary-box p-4 shadow-sm">

    <h5 className="fw-bold border-bottom pb-3 mb-3">
      Order Summary
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

    {autoDiscount > 0 && (
      <div className="price-row text-primary">
        <span>Auto Offer</span>
        <span>-₹{autoDiscount}</span>
      </div>
    )}

    {bogoDiscount > 0 && (
      <div className="price-row text-success fw-semibold">
        <span>🎁 BOGO Savings</span>
        <span>-₹{bogoDiscount}</span>
      </div>
    )}

    <hr />

    <div className="price-row total-row">
      <span>Final Total</span>
      <span>₹{finalTotal}</span>
    </div>

    {(discount + autoDiscount + bogoDiscount) > 0 && (
      <p className="text-success small mt-2 mb-0">
        You saved ₹
        {discount + autoDiscount + bogoDiscount}
      </p>
    )}

    {coupon && (
      <div className="mt-3">
        <span className="badge bg-success">
          Coupon Applied: {coupon.code}
        </span>
      </div>
    )}

  </div>
</div>

          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
         <div className="payment-card p-4 shadow-sm">

<h4 className="fw-bold mb-4 border-bottom pb-3">
Choose Payment Method
</h4>

{/* COD */}
<label
className={`payment-option ${
paymentMethod==="COD" ? "selected-payment" : ""
}`}
>
<input
type="radio"
checked={paymentMethod==="COD"}
onChange={()=>setPaymentMethod("COD")}
/>

<div className="ms-3">
<h6 className="mb-1">
💵 Cash on Delivery
</h6>
<small className="text-muted">
Pay when order arrives
</small>
</div>

</label>


{/* Online */}
<label
className={`payment-option mt-3 ${
paymentMethod==="ONLINE" ? "selected-payment" : ""
}`}
>
<input
type="radio"
checked={paymentMethod==="ONLINE"}
onChange={()=>setPaymentMethod("ONLINE")}
/>

<div className="ms-3">
<h6 className="mb-1">
💳 Pay Online (Razorpay)
</h6>
<small className="text-muted">
UPI, Cards, Netbanking
</small>
</div>

</label>


{/* Payment Summary */}
<div className="summary-box mt-4 p-3">

<h5 className="fw-bold mb-3">
Payment Summary
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

{autoDiscount > 0 && (
<div className="price-row text-primary">
<span>Auto Discount</span>
<span>-₹{autoDiscount}</span>
</div>
)}

{bogoDiscount > 0 && (
<div className="price-row text-success">
<span>🎁 BOGO Savings</span>
<span>-₹{bogoDiscount}</span>
</div>
)}

<hr/>

<div className="price-row total-row">
<span>Payable</span>
<span>₹{finalTotal}</span>
</div>

<p className="small text-success mt-2 mb-0">
You saved ₹
{discount+autoDiscount+bogoDiscount}
</p>

</div>


<button
className="btn btn-green w-100 mt-4  fw-bold"
onClick={handleFinalOrder}
>
{paymentMethod==="COD"
? "Place Order 🛍"
: "Proceed To Pay 💳"}
</button>

</div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Checkout;