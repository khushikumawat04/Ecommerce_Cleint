import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // ✅ IMPORT
import "../styles/theme.css";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext); // ✅ USE CONTEXT

  return (
    <div className="card card-custom h-100 shadow-sm position-relative">

      {/* DISCOUNT BADGE */}
      {product.discountPercent && (
        <span className="discount-badge">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* IMAGE */}
      <div className="img-wrapper">
        <img
          src={product.images[0]?.url}
          className="product-img zoom-img"
          alt={product.name}
        />
      </div>

      <div className="card-body d-flex flex-column">

        {/* NAME */}
        <h6 className="fw-bold">{product.name}</h6>

        {/* PRICE */}
        <div className="mb-2">
          <span className="price">₹{product.price}</span>

          {product.originalPrice && (
            <span className="ms-2 mrp">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* SAVE */}
        {product.originalPrice && (
          <small className="save-text">
            You save ₹{product.originalPrice - product.price}
          </small>
        )}

        {/* STOCK */}
        <small className={product.inStock ? "stock-in" : "stock-out"}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </small>

        {/* BUTTONS */}
        <div className="mt-auto d-grid gap-2">

          <Link 
            to={`/product/${product._id}`} 
            className="btn btn-outline-green"
          >
            View Details
          </Link>

          {/* ADD TO CART */}
          <button
            className="btn btn-dark add-cart-btn"
            onClick={() => {
              addToCart(product);
              toast.success("Item added to cart 🛒");
            }}
            disabled={!product.inStock}
          >
            <i className="fas fa-cart-plus me-2"></i>
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;