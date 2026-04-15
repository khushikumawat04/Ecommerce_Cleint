import { useState,useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL;

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

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
    // ================= COD =================
    if (paymentMethod === "COD") {

      const res = await fetch(`${baseURL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartTotal,
          address,
          paymentMethod: "COD"
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Order placed successfully 🎉");
        clearCart();
        window.location.href = "/";
      }

    } else {

      // ================= STEP 1: CREATE DB ORDER =================
      const createRes = await fetch(`${baseURL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartTotal,
          address,
          paymentMethod: "ONLINE"
        })
      });

      const createData = await createRes.json();
      const orderId = createData.orderId;

      // ================= STEP 2: CREATE RAZORPAY ORDER =================
      const razorRes = await fetch(`${baseURL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          orderId // 🔥 VERY IMPORTANT
        })
      });

      const razorData = await razorRes.json();

      // ================= STEP 3: OPEN RAZORPAY =================
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEYID,
        amount: razorData.amount,
        currency: "INR",
        order_id: razorData.id,

        handler: async function (response) {

          // ================= STEP 4: VERIFY =================
          const verifyRes = await fetch(`${baseURL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment successful 🎉");
            clearCart();
            window.location.href = "/";
          } else {
            alert("Payment verification failed ❌");
          }
        }
      };

      new window.Razorpay(options).open();
    }

  } catch (err) {
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
                    <span>{item.name} × {item.quantity}</span>
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
              <div className="summary-card">
                <h5>Total</h5>
                <h3>₹{cartTotal}</h3>
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="card p-4 shadow-sm border-0">

            <h4>Select Payment Method</h4>

            <div className="form-check">
              <input type="radio" checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")} />
              <label> Cash on Delivery</label>
            </div>

            <div className="form-check mt-2">
              <input type="radio" checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")} />
              <label> Pay Online (Razorpay)</label>
            </div>

            <button className="btn btn-green mt-3"
              onClick={handleFinalOrder}>
              Place Order 💳
            </button>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Checkout;