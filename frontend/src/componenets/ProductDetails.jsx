import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
   const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
          axios.get(`${baseURL}/api/products/${id}`)
            .then(res => {
        setProduct(res.data.data);
        setMainImage(res.data.data.images[0]?.url);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <h3 className="loading-text">Loading...</h3>;

  return (
    <div className="main-bg">

      <Navbar />

      <div className="container py-5">
        <div className="row">

          {/* LEFT IMAGE */}
          <div className="col-md-6">
            <img
              src={mainImage}
              className="main-product-img mb-3"
              alt={product.name}
            />

            <div className="d-flex gap-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setMainImage(img.url)}
                  className={`thumb ${mainImage === img.url ? "active" : ""}`}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="col-md-6">

            <h3 className="product-title">{product.name}</h3>
            <p className="product-tagline">{product.tagline}</p>

            <div className="mb-3">
              <span className="price-large">₹{product.price}</span>

              {product.originalPrice && (
                <span className="ms-2 mrp">
                  ₹{product.originalPrice}
                </span>
              )}

              {/* {product.discountPercent && (
                <span className="discount-badge ms-2">
                  {product.discountPercent}% OFF
                </span>
              )} */}
            </div>

            <p className="product-desc">{product.shortDescription}</p>

            <ul className="highlight-list">
              {product.highlights?.map((h, i) => (
                <li key={i}>🌿 {h}</li>
              ))}
            </ul>
     

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

      {/* TABS */}
      <div className="container mt-5">

        <div className="tab-wrapper">
          {["description", "benefits", "usage", "details"].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content-box">

          {/* DESCRIPTION */}
          {activeTab === "description" && (
            <div className="content-card">
              <h4 className="section-title">Product Description 🌿</h4>
              <p>{product.fullDescription}</p>
            </div>
          )}

          {/* BENEFITS */}
          {activeTab === "benefits" && (
            <div className="content-card">
              <h4 className="section-title">Benefits 💪</h4>

              <div className="row">
                {product.benefits?.map((b, i) => (
                  <div key={i} className="col-md-6 mb-3">
                    <div className="benefit-card">
                      <i className="fas fa-leaf benefit-icon"></i>
                      <p>{b}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* USAGE */}
          {activeTab === "usage" && (
            <div className="content-card">
              <h4 className="section-title">How to Use 🌿</h4>

              <div className="row">

                {product.usage?.howToUse && (
                  <div className="col-md-6 mb-3">
                    <div className="usage-card">
                      <i className="fas fa-mortar-pestle usage-icon"></i>
                      <h6>How to Use</h6>
                      <p>{product.usage.howToUse}</p>
                    </div>
                  </div>
                )}

                {product.usage?.hairApplication && (
                  <div className="col-md-6 mb-3">
                    <div className="usage-card">
                      <i className="fas fa-spa usage-icon"></i>
                      <h6>Hair</h6>
                      <p>{product.usage.hairApplication}</p>
                    </div>
                  </div>
                )}

                {product.usage?.skinUse && (
                  <div className="col-md-6 mb-3">
                    <div className="usage-card">
                      <i className="fas fa-leaf usage-icon"></i>
                      <h6>Skin</h6>
                      <p>{product.usage.skinUse}</p>
                    </div>
                  </div>
                )}

                {product.usage?.faceApplication && (
                  <div className="col-md-6 mb-3">
                    <div className="usage-card">
                      <i className="fas fa-smile usage-icon"></i>
                      <h6>Face</h6>
                      <p>{product.usage.faceApplication}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* DETAILS */}
          {activeTab === "details" && (
            <div className="content-card">

              <h4 className="section-title">Product Details 📋</h4>

              <table className="table details-table">
                <tbody>

                  <tr>
                    <td><i className="fas fa-tag detail-icon"></i> Brand</td>
                    <td>{product.details?.brand}</td>
                  </tr>

                  <tr>
                    <td><i className="fas fa-box detail-icon"></i> Type</td>
                    <td>{product.details?.productType}</td>
                  </tr>

                  <tr>
                    <td><i className="fas fa-weight detail-icon"></i> Quantity</td>
                    <td>{product.details?.quantity}</td>
                  </tr>

                  <tr>
                    <td><i className="fas fa-leaf detail-icon"></i> Ingredient</td>
                    <td>{product.details?.ingredient}</td>
                  </tr>

                  <tr>
                    <td><i className="fas fa-clock detail-icon"></i> Shelf Life</td>
                    <td>{product.details?.shelfLife}</td>
                  </tr>

                </tbody>
              </table>

            </div>
          )}



        </div>
      </div>
             {/* WHY CHOOSE US */}
<div className="why-choose-box mt-4 ">
  

  {/* WHY CHOOSE US */}
{product.whyChoose?.length > 0 && (
  <div className="why-choose-box mt-4">
    <h5 className="mb-3">Why Choose This Product?</h5>

    <ul className="why-list">
      {product.whyChoose.map((point, i) => (
        <li key={i}>
          <i className="fas fa-check-circle me-2"></i>
          {point}
        </li>
      ))}
    </ul>
  </div>
)}
</div>

      <Footer />
    </div>
  );
}

export default ProductDetails;