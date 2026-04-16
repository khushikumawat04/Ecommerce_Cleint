import React from "react";
import { Helmet } from "react-helmet";
import "../styles/legalpages.css"
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function Terms() {
  return (
    <>
      <Navbar/>
   <div className="container py-5">

      <Helmet>
        <title>Terms & Conditions | Karmaass</title>
        <meta
          name="description"
          content="Terms and conditions for using Karmaass website and services."
        />
      </Helmet>

      <h1>Terms & Conditions</h1>

      <ul>
        <li>All orders are subject to acceptance.</li>
        <li>We reserve the right to cancel suspicious transactions.</li>
        <li>Prices and availability may change without notice.</li>
      </ul>

      <p>
        By using this website, you agree to our terms.
      </p>
    </div>
    <Footer/>
        </>
  );
}