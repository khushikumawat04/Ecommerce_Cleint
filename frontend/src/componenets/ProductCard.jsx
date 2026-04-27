import React,
{
useContext,
useEffect,
useState
}
from "react";

import {Link}
from "react-router-dom";

import axios from "axios";

import {CartContext}
from "../context/CartContext";

import "../styles/theme.css";

import {toast}
from "react-toastify";



function ProductCard({product}){

const {addToCart}=useContext(CartContext);

const [offers,setOffers]=useState([]);

const baseURL=
process.env.REACT_APP_API_URL;



useEffect(()=>{

fetchOffers();

},[product._id]);


const fetchOffers=async()=>{

try{

const res=
await axios.get(
`${baseURL}/api/offers`
);

const matchedOffers=
res.data.filter(
offer=>
offer.productId?._id===product._id
);

setOffers(matchedOffers);

}catch(err){
console.log(err);
}

};



const renderOfferBadge=(offer)=>{

if(offer.type==="coupon"){
return `🎟 ${offer.code} ${offer.discountPercent}% OFF`;
}

if(offer.type==="bogo"){
return `🎁 Buy ${offer.buyQty} Get ${offer.freeQty}`;
}

if(offer.type==="auto_discount"){
return `🔥 ${offer.discountPercent}% OFF Above ₹${offer.minOrderValue}`;
}

return offer.title;
};



return(

<div className="card card-custom h-100 shadow-sm position-relative">


{/* Existing discount badge */} 
 {product.discountPercent &&(
<span className="discount-badge">
{product.discountPercent}% OFF
</span>
)}



{/* Dynamic Offers */}
<div className="offer-wrapper">

{offers.map(offer=>(
<div
key={offer._id}
className="offer-badge-custom"
>
{renderOfferBadge(offer)}
</div>
))}

</div>



<div className="img-wrapper">

<img
src={product.images[0]?.url}
className="product-img zoom-img"
alt={product.name}
/>

</div>



<div className="card-body d-flex flex-column">

<h6 className="fw-bold">
{product.name}
</h6>


<div className="mb-2">


<span className="price">
₹{product.price}
</span>

{product.originalPrice&&(
<span className="ms-2 mrp">
₹{product.originalPrice}
</span>
)}

</div>



{product.originalPrice&&(
<small className="save-text">
You save ₹
{product.originalPrice-product.price}
</small>
)}


<small
className={
product.inStock
? "stock-in"
: "stock-out"
}
>
{
product.inStock
? "In Stock"
: "Out Of Stock"
}
</small>



<div className="mt-auto d-grid gap-2">

<Link
to={`/product/${product._id}`}
className="btn btn-outline-green"
>
View Details
</Link>


<button
className="btn btn-dark add-cart-btn"
disabled={!product.inStock}
onClick={()=>{

addToCart(product);

toast.success(
"Item added to cart 🛒"
);

}}
>

<i className="fas fa-cart-plus me-2"></i>

{
product.inStock
?
"Add To Cart"
:
"Out Of Stock"
}

</button>

</div>

</div>

</div>

)

}

export default ProductCard;