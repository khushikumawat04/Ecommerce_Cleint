import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <Helmet>
        <title>Privacy Policy | Karmaass</title>
        <meta
          name="description"
          content="Read Karmaass privacy policy to understand how we collect, use, and protect your data."
        />
      </Helmet>

      <div className="container py-5">
        <div className="legal-page shadow-sm p-4 p-md-5 rounded">

          <h1 className="legal-title text-center mb-4">
            Privacy Policy
          </h1>

          {/* <p className="effective-date text-center">
            <strong>Effective Date:</strong> [Date daalo]
          </p> */}

          <p className="intro-text">
            Welcome to Karmaas. Your privacy is important to us. This Privacy
            Policy explains how we collect, use and protect your information
            when you visit our website.
          </p>

          <div className="policy-section">
            <h4>1. Information We Collect</h4>
            <p>We may collect the following types of information:</p>

            <ul className="policy-list">
              <li>Personal Information (Name, Email, Phone Number, Address)</li>
              <li>Payment Information (processed securely via third-party services)</li>
              <li>Device Information (Browser type, IP address)</li>
              <li>Usage Data (Pages visited, time spent)</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>2. How We Use Your Information</h4>

            <ul className="policy-list">
              <li>Process orders and deliveries</li>
              <li>Improve our website and services</li>
              <li>Communicate with you (order updates, support)</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>3. Sharing Your Information</h4>
            <p>We do not sell your personal data. However, we may share information with:</p>

            <ul className="policy-list">
              <li>Delivery partners (e.g. Shiprocket)</li>
              <li>Payment gateways</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>4. Cookies</h4>
            <p>
              We use cookies to improve your browsing experience. You can disable
              cookies in your browser settings.
            </p>
          </div>

          <div className="policy-section">
            <h4>5. Data Security</h4>
            <p>
              We take appropriate security measures to protect your data,
              however no method is 100% secure.
            </p>
          </div>

          <div className="policy-section">
            <h4>6. Your Rights</h4>

            <ul className="policy-list">
              <li>Access your data</li>
              <li>Request correction or deletion</li>
              <li>Opt-out of marketing emails</li>
            </ul>
          </div>

          <div className="policy-section">
            <h4>7. Third-Party Links</h4>
            <p>
              Our website may contain links to other websites. We are not
              responsible for their privacy policies.
            </p>
          </div>

          <div className="policy-section">
            <h4>8. Changes To This Policy</h4>
            <p>
              We may update this Privacy Policy from time to time.
              Changes will be posted on this page.
            </p>
          </div>

          <div className="policy-section border-top pt-4 mt-4">
            <h4>9. Contact Us</h4>

            <p className="mb-2">
              Email:{" "}
              <a href="mailto:karmaas.in@gmail.com">
                karmaas.in@gmail.com
              </a>
            </p>

            <p className="mb-0">
              Phone: +91 9752504406
            </p>
          </div>

          <div className="policy-footer-note mt-4">
            By using our website, you agree to this Privacy Policy.
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}