import React from "react";
import { Helmet } from "react-helmet";
import "../styles/about.css"
import Footer from "../componenets/Footer";
import Navbar from "../componenets/Navbar";

export default function AboutUs() {
  return (
    <>
    <Navbar/>
    <div className="about-wrapper mt-5">

      <Helmet>
        <title>About Us | Karmaass</title>
        <meta
          name="description"
          content="Learn about Karmaass, our mission, vision, and commitment to quality wellness products in India."
        />
      </Helmet>

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-container">
          <span className="about-badge">Trusted Indian Brand</span>

          <h1 className="about-title">About Karmaass</h1>

          <p className="about-subtitle">
            Karmaass is operated by <b>Karmaass Wellness Pvt. Ltd.</b>, a registered
            Indian business focused on delivering high-quality wellness and lifestyle products.
          </p>
        </div>
      </section>

      {/* GRID SECTION */}
      <section className="about-content">
        <div className="about-container grid">

          <div className="about-card">
            <h3>👤 Founder</h3>
            <p>John Doe (Founder & CEO)</p>
          </div>

          <div className="about-card">
            <h3>🏢 Registered Address</h3>
            <p>
              Karmaass Wellness Pvt. Ltd.<br />
              Indore, Madhya Pradesh, India
            </p>
          </div>

          <div className="about-card">
            <h3>🎯 Our Mission</h3>
            <p>
              To provide safe, effective, and affordable wellness products that
              improve everyday life.
            </p>
          </div>

          <div className="about-card">
            <h3>💡 Our Vision</h3>
            <p>
              To become a trusted global wellness brand known for transparency and quality.
            </p>
          </div>

        </div>
      </section>

      {/* STORY SECTION */}
      <section className="about-story">
        <div className="about-container">
          <h2>Our Story</h2>

          <p>
            Karmaass started with a simple idea — to make wellness accessible and
            trustworthy for everyone in India. We noticed a gap in quality and
            transparency in the market, and we decided to build a brand that people
            can trust.
          </p>

          <p>
            Every product we offer goes through quality checks and is sourced with
            care to ensure customer satisfaction and safety.
          </p>
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
}