import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css"
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";


export default function PrivacyPolicy() {
  return (
    <>
   <Navbar/>
    <div className="container py-5">
      
      <Helmet>
        <title>Privacy Policy | Karmaass</title>
        <meta
          name="description"
          content="Read Karmaass privacy policy to understand how we collect, use, and protect your data."
        />
      </Helmet>

      <h1>Privacy Policy</h1>
      <p>
        We respect your privacy and are committed to protecting your personal
        information.
      </p>

      <h5>Information We Collect</h5>
      <ul>
        <li>Name, phone number, email</li>
        <li>Shipping address</li>
        <li>Order details</li>
      </ul>

      <h5>How We Use Information</h5>
      <ul>
        <li>Order processing</li>
        <li>Customer support</li>
        <li>Improving user experience</li>
      </ul>

      <p>
        We do not sell or misuse customer data.
      </p>
    </div>
    <Footer/>
     </>
  );
}