import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

export default function RefundPolicy() {
  return (
    <>
      <Navbar />

      <Helmet>
        <title>Refund & Return Policy | Karmaass</title>
        <meta
          name="description"
          content="Refund and return policy of Karmaass."
        />
      </Helmet>

      <div className="container py-5">
        <div className="legal-page shadow-sm p-4 p-md-5 rounded">

          <h1 className="legal-title text-center mb-4">
            Refund & Return Policy
          </h1>

          {/* <p className="effective-date text-center">
            <strong>Effective Date:</strong> [Date daalo]
          </p> */}

          <p className="intro-text">
            At Karmaas, we aim to provide the best quality products.
          </p>

          <div className="policy-section">
            <h4>1. Return Eligibility</h4>
            <ul className="policy-list">
              <li>Returns are accepted within 7 days of delivery.</li>
              <li>Product must be unused and in original packaging.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>2. Non-Returnable Items</h4>
            <ul className="policy-list">
              <li>Used products</li>
              <li>Products damaged by customer</li>
              <li>Items without original packaging</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>3. Refund Process</h4>
            <ul className="policy-list">
              <li>
                Once we receive and inspect the product, refund will be
                processed within 5–7 business days.
              </li>
              <li>
                Refund will be issued to the original payment method.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>4. Replacement</h4>
            <p>
              If a product is defective or a wrong item is received,
              we offer replacement.
            </p>
          </div>

          <div className="policy-section">
            <h4>5. Return Shipping</h4>
            <p>
              Customer may need to pay return shipping unless the
              product is defective.
            </p>
          </div>

          <div className="policy-section border-top pt-4 mt-4">
            <h4>6. Contact</h4>
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