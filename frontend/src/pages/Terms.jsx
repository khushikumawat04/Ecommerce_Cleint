import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css";
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function Terms() {
  return (
    <>
      <Navbar />

      <Helmet>
        <title>Terms & Conditions | Karmaass</title>
        <meta
          name="description"
          content="Terms and conditions for using Karmaass website and services."
        />
      </Helmet>

      <div className="container py-5">
        <div className="legal-page shadow-sm p-4 p-md-5 rounded">

          <h1 className="legal-title text-center mb-4">
            Terms & Conditions
          </h1>

          {/* <p className="effective-date text-center">
            <strong>Effective Date:</strong> [Date daalo]
          </p> */}

          <p className="intro-text">
            Welcome to Karmaas. By using our website, you agree to the
            following terms:
          </p>

          <div className="policy-section">
            <h4>1. Use of Website</h4>
            <ul className="policy-list">
              <li>
                You must be at least 18 years old or using under supervision.
              </li>
              <li>
                You agree not to misuse the website or engage in illegal
                activities.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>2. Products & Pricing</h4>
            <ul className="policy-list">
              <li>
                All prices are listed in INR and may change without notice.
              </li>
              <li>
                We try to ensure product details are accurate, but errors may
                occur.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>3. Orders</h4>
            <ul className="policy-list">
              <li>
                We reserve the right to cancel any order due to stock or pricing
                issues.
              </li>
              <li>
                Once an order is placed, you will receive confirmation via
                email/SMS.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>4. Payments</h4>
            <ul className="policy-list">
              <li>
                Payments are processed securely via third-party payment gateways.
              </li>
              <li>
                We are not responsible for payment failures due to bank issues.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>5. Intellectual Property</h4>
            <p>
              All content including logo, images, text and branding belongs to
              Karmaas and cannot be reused without permission.
            </p>
          </div>

          <div className="policy-section">
            <h4>6. Limitation of Liability</h4>
            <p>
              We are not responsible for any indirect damages arising from use
              of this website.
            </p>
          </div>

          <div className="policy-section">
            <h4>7. Changes to Terms</h4>
            <p>
              We may update these terms anytime without prior notice.
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