import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css"
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

export default function RefundPolicy() {
  return (
    <>
    <Navbar/>
    <div className="container py-5">

      <Helmet>
        <title>Refund Policy | Karmaass</title>
        <meta
          name="description"
          content="Refund and return policy of Karmaass."
        />
      </Helmet>

      <h1>Refund Policy</h1>

      <ul>
        <li>Refunds applicable only for damaged/wrong products.</li>
        <li>Request within 3–7 days of delivery.</li>
        <li>Refund processed within 5–10 business days.</li>
      </ul>

    </div>
    <Footer/>
     </>
  );
}