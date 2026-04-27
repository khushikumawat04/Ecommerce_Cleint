import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";

export default function OfferAdmin() {

const baseURL = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");

const [products,setProducts] = useState([]);
const [loading,setLoading] = useState(false);

const [form,setForm] = useState({
productId:"",
type:"coupon",

title:"",
code:"",
discountPercent:"",
minOrderValue:"",

buyQty:"",
freeQty:""
});


/* FETCH PRODUCTS */
useEffect(()=>{

fetchProducts();

},[]);


const fetchProducts = async() => {
try{

const res = await axios.get(
`${baseURL}/api/products`
);

setProducts(res.data.data || []);

}catch(err){
console.log(err);
}
};


/* INPUT CHANGE */
const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};



/* SUBMIT OFFER */
const submit=async(e)=>{
e.preventDefault();

try{

setLoading(true);

await axios.post(
`${baseURL}/api/offers`,
form,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

alert("Offer Created Successfully 🎉");


setForm({
productId:"",
type:"coupon",

title:"",
code:"",
discountPercent:"",
minOrderValue:"",

buyQty:"",
freeQty:""
});

}
catch(err){
console.log(err);
alert("Offer creation failed");
}
finally{
setLoading(false);
}

};



return(
<AdminLayout>

<div className="container p-4">

<h3 className="mb-4">
🎁 Offer Admin Panel
</h3>


<form onSubmit={submit}>

{/* PRODUCT */}
<label className="mb-2">
Select Product
</label>

<select
name="productId"
value={form.productId}
className="form-control mb-3"
onChange={handleChange}
required
>
<option value="">
Select Product
</option>

{products.map((p)=>(
<option
key={p._id}
value={p._id}
>
{p.name}
</option>
))}

</select>



{/* OFFER TYPE */}
<label className="mb-2">
Offer Type
</label>

<select
name="type"
value={form.type}
onChange={handleChange}
className="form-control mb-3"
>

<option value="coupon">
Coupon Code
</option>

<option value="auto_discount">
Auto 10% Above Order Value
</option>

<option value="bogo">
Buy 1 Get 1
</option>

</select>



{/* TITLE */}
<input
name="title"
value={form.title}
placeholder="Offer Title"
className="form-control mb-3"
onChange={handleChange}
/>



{/* ================= COUPON ================= */}

{form.type==="coupon" && (
<>

<input
name="code"
value={form.code}
placeholder="Coupon Code (SAVE20)"
className="form-control mb-3"
onChange={handleChange}
required
/>

<input
name="discountPercent"
value={form.discountPercent}
placeholder="Discount %"
className="form-control mb-3"
onChange={handleChange}
required
/>

</>
)}



{/* ================= AUTO DISCOUNT ================= */}

{form.type==="auto_discount" && (
<>

<input
name="discountPercent"
value={form.discountPercent}
placeholder="Discount %"
className="form-control mb-3"
onChange={handleChange}
required
/>

<input
name="minOrderValue"
value={form.minOrderValue}
placeholder="Minimum Order Value (999)"
className="form-control mb-3"
onChange={handleChange}
required
/>

</>
)}



{/* ================= BOGO ================= */}

{form.type==="bogo" && (
<>

<input
name="buyQty"
value={form.buyQty}
placeholder="Buy Quantity"
className="form-control mb-3"
onChange={handleChange}
required
/>

<input
name="freeQty"
value={form.freeQty}
placeholder="Free Quantity"
className="form-control mb-3"
onChange={handleChange}
required
/>

</>
)}



<button
type="submit"
className="btn btn-success w-100 mt-3"
disabled={loading}
>
{loading ? "Saving..." : "Save Offer"}
</button>

</form>

</div>

</AdminLayout>
)

}