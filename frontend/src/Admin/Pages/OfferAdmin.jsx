import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { confirmToast } from "../../Utils/confirmToast";

export default function OfferAdmin() {

const baseURL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

const [products,setProducts] = useState([]);
const [loading,setLoading] = useState(false);
const [offers, setOffers] = useState([]);
const [editId, setEditId] = useState(null);


// fethc offer
const fetchOffers = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/offers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOffers(res.data.offers || []);
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};

const [form,setForm] = useState({
type:"coupon",
title:"",
code:"",
discountPercent:"",
minOrderValue:"",
buyQty:"",
freeQty:"",
applyTo:"all",
applicableProducts:[],
applicableCategory:"",
productId:"",
startDate:"",
endDate:""
});

// Edit offer
const editOffer = (offer) => {
  setEditId(offer._id);

  setForm({
    type: offer.type || "coupon",
    title: offer.title || "",
    code: offer.code || "",
    discountPercent: offer.discountPercent || "",
    minOrderValue: offer.minOrderValue || "",
    buyQty: offer.buyQty || "",
    freeQty: offer.freeQty || "",
    applyTo: offer.applyTo || "all",
    applicableProducts: offer.applicableProducts || [],
    applicableCategory: offer.applicableCategory || "",
    productId: offer.productId || "",
    startDate: offer.startDate?.slice(0,10) || "",
    endDate: offer.endDate?.slice(0,10) || ""
  });
};

// Delete Offer

const deleteOffer = (id) => {
  confirmToast({
    message: "Delete this offer?",
    onConfirm: async () => {
      try {
        await axios.delete(`${baseURL}/api/offers/offer/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("🗑️ Offer deleted");
        fetchOffers();

      } catch (err) {
        toast.error("Error deleting offer");
      }
    }
  });
};
/* FETCH PRODUCTS */
useEffect(()=>{
fetchProducts();
fetchOffers();
},[]);

// get products name 
const getProductNames = (ids = []) => {
  return products
    .filter(p => ids.includes(p._id))
    .map(p => p.name)
    .join(", ");
};

// fetch all products
const fetchProducts = async()=>{
try{
const res = await axios.get(`${baseURL}/api/products`);
setProducts(res.data.data || []);
}catch(err){
console.log(err);
}
};

/* HANDLE CHANGE */
const handleChange=(e)=>{
const { name,value } = e.target;

let updated = {
...form,
[name]:value
};

/* 🔥 BOGO FIX */
if(name==="type" && value==="bogo"){
updated.applyTo = "products";
updated.applicableProducts = [];
updated.applicableCategory = "";
}

/* reset when switching */
if(name==="type" && value!=="bogo"){
updated.productId="";
updated.buyQty="";
updated.freeQty="";
}

setForm(updated);
};

/* SUBMIT */
const submit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    let payload = { ...form };

    if (!payload.productId) {
      delete payload.productId;
    }

    if (editId) {
      // UPDATE
      await axios.put(
        `${baseURL}/api/offers/offer/${editId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Offer Updated");
    } else {
      // CREATE
      await axios.post(
        `${baseURL}/api/offers`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Offer Created");
    }

    fetchOffers();

    // RESET
    setEditId(null);
    setForm({
      type: "coupon",
      title: "",
      code: "",
      discountPercent: "",
      minOrderValue: "",
      buyQty: "",
      freeQty: "",
      applyTo: "all",
      applicableProducts: [],
      applicableCategory: "",
      productId: "",
      startDate: "",
      endDate: ""
    });

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
};

return(
<AdminLayout>

<div className="container mt-4">

<h3 className="mb-4">🎁 Offer Admin Panel</h3>

<form onSubmit={submit} className="card p-4 shadow">

{/* TYPE */}
<div className="mb-3">
<label className="form-label">Offer Type</label>
<select
name="type"
value={form.type}
onChange={handleChange}
className="form-select"
>
<option value="coupon">Coupon</option>
<option value="auto_discount">Auto Discount</option>
<option value="bogo">BOGO</option>
</select>
</div>

{/* TITLE */}
<div className="mb-3">
<input
name="title"
value={form.title}
placeholder="Offer Title"
className="form-control"
onChange={handleChange}
/>
</div>

{/* APPLY TO */}
{form.type !== "bogo" && (
<div className="mb-3">
<label className="form-label">Apply To</label>
<select
name="applyTo"
value={form.applyTo}
onChange={handleChange}
className="form-select"
>
<option value="all">All Products</option>
<option value="products">Selected Products</option>
<option value="category">Category</option>
</select>
</div>
)}

{/* MULTI PRODUCTS */}
{form.applyTo==="products" && form.type!=="bogo" && (
<div className="mb-3">
<label className="form-label">Select Products</label>
<select
  multiple
  className="form-select"
  value={form.applicableProducts}   // ✅ IMPORTANT
  onChange={(e)=>{
    const selected=[...e.target.selectedOptions].map(o=>o.value);
    setForm({...form,applicableProducts:selected});
  }}
>

{products.map(p=>(
<option key={p._id} value={p._id}>
{p.name}
</option>
))}
</select>
</div>
)}

{/* CATEGORY */}
{form.applyTo==="category" && form.type!=="bogo" && (
<div className="mb-3">
<input
  name="applicableCategory"
  value={form.applicableCategory}   // ✅ ADD THIS
  placeholder="Enter Category"
  className="form-control"
  onChange={handleChange}
/>
</div>
)}

{/* COUPON */}
{form.type==="coupon" && (
<>
<div className="mb-3">
<input
name="code"
value={form.code}
placeholder="Coupon Code"
className="form-control"
onChange={handleChange}
required
/>
</div>

<div className="mb-3">
<input
name="discountPercent"
value={form.discountPercent}
placeholder="Discount %"
className="form-control"
onChange={handleChange}
required
/>
</div>
</>
)}

{/* AUTO */}
{form.type==="auto_discount" && (
<>
<div className="mb-3">
<input
name="discountPercent"
value={form.discountPercent}
placeholder="Discount %"
className="form-control"
onChange={handleChange}
required
/>
</div>

<div className="mb-3">
<input
name="minOrderValue"
value={form.minOrderValue}
placeholder="Minimum Order Value"
className="form-control"
onChange={handleChange}
required
/>
</div>
</>
)}

{/* BOGO */}
{form.type==="bogo" && (
<>
<div className="mb-3">
<label className="form-label">Select Product</label>
<select
name="productId"
value={form.productId}
onChange={handleChange}
className="form-select"
required
>
<option value="">Select Product</option>
{products.map(p=>(
<option key={p._id} value={p._id}>
{p.name}
</option>
))}
</select>
</div>

<div className="mb-3">
<input
name="buyQty"
value={form.buyQty}
placeholder="Buy Quantity"
className="form-control"
onChange={handleChange}
required
/>
</div>

<div className="mb-3">
<input
name="freeQty"
value={form.freeQty}
placeholder="Free Quantity"
className="form-control"
onChange={handleChange}
required
/>
</div>
</>
)}

{/* DATE */}
<div className="mb-3">
    <input
  type="date"
  name="startDate"
  value={form.startDate}   // ✅
  className="form-control"
  onChange={handleChange}
/>
</div> 

<div className="mb-3">
<input
  type="date"
  name="endDate"
  value={form.endDate}   // ✅
  className="form-control"
  onChange={handleChange}
/> 
</div>
<button
  type="submit"
  className={`btn w-100 ${editId ? "btn-primary" : "btn-success"}`}
  disabled={loading}
>
  {loading
    ? editId
      ? "Updating..."
      : "Saving..."
    : editId
    ? "Update Offer"
    : "Save Offer"}
</button>

</form>





{/* Display List of offers */}
<div className="mt-5">
  <h4>📋 All Offers</h4>

  <table className="table table-bordered mt-3">
    <thead>
      <tr>
        <th>Title</th>
        <th>Type</th>
        <th>Discount</th>
        <th>Applicable Products</th>
        <th>Actions</th>
      </tr>
    </thead>

   <tbody>
  {offers.map((o) => (
    <tr key={o._id}>
      <td>{o.title || "-"}</td>

      {/* TYPE */}
      <td>
        {o.type === "bogo" && "BOGO"}
        {o.type === "coupon" && "Coupon"}
        {o.type === "auto_discount" && "Auto Discount"}
      </td>

      {/* DETAILS */}
      <td>
        {o.type === "bogo" && (
          <>Buy {o.buyQty} Get {o.freeQty}</>
        )}

        {o.type !== "bogo" && (
          <>{o.discountPercent}% OFF</>
        )}
      </td>

      {/* APPLY TARGET */}
     <td>
  {o.type === "bogo" ? (
    products.find(p => p._id === (o.productId?._id || o.productId))?.name || "Product"
  ) : o.applyTo === "all" ? (
    "All Products"
  ) : o.applyTo === "products" ? (
   o.applicableProducts.map(p => p.name).join()
  ) : o.applyTo === "category" ? (
    `Category: ${o.applicableCategory}`
  ) : (
    "-"
  )}
</td>

      {/* ACTIONS */}
      <td>
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => editOffer(o)}
        >
          Edit
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => deleteOffer(o._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
  </table>
</div>
</div>

</AdminLayout>
);
}