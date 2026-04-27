import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css";
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function ShippingPolicy() {
  return (
    <>
      <Navbar />

      <Helmet>
        <title>Shipping Policy | Karmaass</title>
        <meta
          name="description"
          content="Shipping details, delivery timelines and tracking information."
        />
      </Helmet>

      <div className="container py-5">
        <div className="legal-page shadow-sm p-4 p-md-5 rounded">
          <h1 className="legal-title mb-4 text-center">
            Shipping Policy
          </h1>

          {/* <p className="effective-date text-center">
            <strong>Effective Date:</strong> [Date daalo]
          </p> */}

          <div className="policy-section">
            <h4>1. Order Processing</h4>
            <p>
              Orders are processed within <strong>1–3 business days</strong>.
            </p>
          </div>

          <div className="policy-section">
            <h4>2. Delivery Time</h4>
            <p>
              Standard delivery takes{" "}
              <strong>3–7 business days</strong> depending on location.
            </p>
          </div>

          <div className="policy-section">
            <h4>3. Shipping Charges</h4>
            <p>
              Shipping charges are calculated at checkout or may be free on
              selected orders.
            </p>
          </div>

          <div className="policy-section">
            <h4>4. Delivery Partners</h4>
            <p>
              We use trusted delivery partners like{" "}
              <strong>Shiprocket</strong>.
            </p>
          </div>

          <div className="policy-section">
            <h4>5. Delays</h4>
            <p>
              Delays may occur due to weather conditions, holidays, or courier
              issues.
            </p>
          </div>

          <div className="policy-section">
            <h4>6. Order Tracking</h4>
            <p>
              Tracking details will be shared via SMS/email after dispatch.
            </p>
          </div>

          <div className="policy-section">
            <h4>7. Incorrect Address</h4>
            <p>
              We are not responsible for delivery failure due to incorrect
              shipping addresses provided by customers.
            </p>
          </div>

          <div className="policy-section border-top pt-4 mt-4">
            <h4>8. Contact</h4>
            <p className="mb-0">
              Email:{" "}
              <a href="mailto:karmaas.in@gmail.com">
                karmaas.in@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}