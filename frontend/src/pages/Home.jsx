import { useEffect, useState } from "react";
import axios from "axios";

import ProductCard from "../componenets/ProductCard";
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
   const baseURL = process.env.REACT_APP_API_URL;
   const [category, setCategory] = useState("All");
   const [offers, setOffers] = useState([]);
const isSimilar = (a, b) => {
  return a.includes(b) || b.includes(a);
};

  useEffect(() => {
    axios.get(`${baseURL}/api/products`)
      .then(res => {
        setProducts(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);
const filteredProducts = products.filter(product => {
  const name = product.name.toLowerCase();
  const query = searchTerm.toLowerCase();

  // ✅ Search logic (your existing)
  const matchesSearch =
    name.includes(query) ||
    name.startsWith(query) ||
    name.split(" ").some(word => word.startsWith(query)) ||
    isSimilar(name, query);

  // ✅ Category logic (new)
  const matchesCategory =
    category === "All"
      ? true
      : category === "Best"
      ? product.isBest === true
      : product.category === category;

  return matchesSearch && matchesCategory;
});

//         useEffect(()=>{

// axios
// .get(`${baseURL}/api/offers`)
// .then(res=>{
// setOffers(res.data);
// })

// },[])

  return (
    <div className="main-bg">

  <Navbar onSearch={setSearchTerm} products={products}  />

      {/* HERO SECTION */}
      <div className="hero-section text-center">
        <h1 className="hero-title">
          Natural Care for Better Life 🌿
        </h1>
        <p className="hero-subtitle">
          Pure Herbal Products for Hair, Skin & Wellness
        </p>
        <button className="btn btn-green mt-3">
          Shop Now
        </button>
        {/* {offers.map(o=>(
<div key={o._id}>
{o.title}
</div>
))} */}

      </div>
  
      {/* PRODUCTS */}
      <div className="container py-5">
        <h2 className="section-title text-center custom-heading">
          Our Products
        </h2>
        {/* ✅ FILTER BUTTONS */}
  <div className="filter-buttons text-center mt-5">
    {["All", "Health & Wellness", "Hair Care", "Skin Care"].map(cat => (
      <button
        key={cat}
        className={`filter-btn ${category === cat ? "active" : ""}`}
        onClick={() => setCategory(cat)}
      >
        {cat}
      </button>
    ))}
  </div>

        <div className="row justify-content-center mt-5">
          {filteredProducts.map(product => (
            <div className="col-md-3 mb-4" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className="container my-5">

        <h2 className="section-title text-center custom-heading">
          Why Choose Us
        </h2>

        <div className="section-box mt-5">

          <div className="row text-center">

            <div className="col-md-4 mb-4">
              <div className="benefit-item">
                <h1>🚚</h1>
                <h5>Fast Delivery</h5>
                <p>Quick and reliable shipping at your doorstep</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="benefit-item">
                <h1>💰</h1>
                <h5>Best Prices</h5>
                <p>Get the best value for your money</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="benefit-item">
                <h1>✅</h1>
                <h5>Authentic Products</h5>
                <p>100% genuine and trusted quality</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Home;