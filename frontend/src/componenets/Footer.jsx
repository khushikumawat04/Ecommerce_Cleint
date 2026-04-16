import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/footer.css";
import { Link } from "react-router-dom";  

const Footer = () => {
  return (
    <footer className="footer">

      {/* TOP TRUST STRIP */}


      {/* MAIN FOOTER */}
      <div className="container py-5">
        <div className="row">

          {/* BRAND */}
          <div className="col-md-3 mb-4">
            {/* <h4 className="brand">Karmaas</h4>
             */}
             <img src="https://res.cloudinary.com/dj8yfrchq/image/upload/v1775118735/1_2_qh2xni.png
             " alt="Karmaas Logo" height={100} width={300} />
            {/* <p>
              Natural products crafted for hair, skin & wellness. 
              Clean ingredients. Real results.
            </p> */}

            {/* SOCIAL */}
            <div className="social-icons">
              <i className="bi bi-instagram"></i>
              <i className="bi bi-facebook"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>

          {/* SHOP */}
          <div className="col-md-2 mb-4">
            <h6>Shop</h6>
            <ul>
              <li><a href="#">Hair Care</a></li>
              <li><a href="#">Skin Care</a></li>
              <li><a href="#">Wellness</a></li>
              <li><a href="#">Combos</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="col-md-2 mb-4">
            <h6>Support</h6>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>

          {/* COMPANY */}
           <div className="col-md-4 mb-4">
            <h6>Company</h6>
            <ul className="list-unstyled">
              <li><Link className="text-white" to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="text-white" to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link className="text-white" to="/refund-policy">Refund Policy</Link></li>
              <li><Link className="text-white" to="/shipping-policy">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          {/* <div className="col-md-3 mb-4">
            <h6>Join Our Community</h6>
            <p>Get offers, tips & exclusive deals</p>

            <div className="d-flex">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
              <button className="btn btn-subscribe ms-2">Join</button>
            </div>
          </div> */}

        </div>
      </div>

    

      {/* BOTTOM BAR */}
      <div className="footer-bottom text-center py-3">
        <p className="mb-0">
          © {new Date().getFullYear()} Karmaas. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;