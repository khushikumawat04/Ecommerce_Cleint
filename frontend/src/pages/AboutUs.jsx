import React from "react";
import { Helmet } from "react-helmet";
import "../styles/about.css";
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <div className="about-wrapper mt-5">

        <Helmet>
          <title>About Us | KARMAA'S</title>
          <meta
            name="description"
            content="Learn about KARMAA'S, a registered Indian proprietorship committed to quality products and trusted service."
          />
        </Helmet>

        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-container">
            <span className="about-badge">Registered Indian Business</span>

            <h1 className="about-title">About KARMAA'S</h1>

            <p className="about-subtitle">
              KARMAA'S is a registered Indian proprietorship business operated by
              <b> Aditi Karma</b>, focused on delivering quality products with trust,
              transparency and customer satisfaction.
            </p>
          </div>
        </section>

        {/* GRID SECTION */}
        <section className="about-content">
          <div className="about-container grid">

            <div className="about-card">
              <h3>👤 Proprietor</h3>
              <p>Aditi Karma</p>
            </div>

            <div className="about-card">
              <h3>🏢 Registered Business</h3>
              <p>
                Proprietorship Firm <br />
                Trade Name: KARMAA'S
              </p>
            </div>

            <div className="about-card">
              <h3>📍 Principal Place of Business</h3>
              <p>
                Kasrawad Road, Sukhpuri <br />
                Near Khushbu Furniture Mart <br />
                Khargone, Madhya Pradesh - 451001
              </p>
            </div>

            <div className="about-card">
              <h3>🧾 GST Registered</h3>
              <p>
                GSTIN: 23JAWPK1106A1Z1 <br />
                Registration Type: Regular
              </p>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-story">
          <div className="about-container">
            <h2>Who We Are</h2>

            <p>
              KARMAA'S is built on the values of trust, quality, and customer-first
              service. As a registered Indian business, we aim to provide reliable
              products and a smooth shopping experience to our customers.
            </p>

            <p>
              We focus on maintaining transparency, authenticity, and consistent
              quality in everything we offer.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}