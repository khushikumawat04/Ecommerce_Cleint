import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css"
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function ShippingPolicy() {
  return (
    <>
      <Navbar/>
      <div className="container py-5">

      <Helmet>
        <title>Shipping Policy | Karmaass</title>
        <meta
          name="description"
          content="Shipping details, delivery timelines and tracking information."
        />
      </Helmet>

      <h1>Shipping Policy</h1>

      <ul>
        <li>Orders processed in 24–48 hours</li>
        <li>Delivery time: 3–7 business days</li>
        <li>Tracking provided after dispatch</li>
      </ul>

    </div>
    <Footer/>
        </>
  );
}