import React, { useState } from "react";
import "../styles/contact.css";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";

export default function Contact() {
  const [success, setSuccess] = useState(false);
    const baseURL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      hidden: e.target.hidden.value
    };

    const res = await fetch(`${baseURL}/api/contact/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSuccess(true);
      e.target.reset();
    }
  };

 return (
  <>
  <Navbar/>
  <div className="contact-container">

    {/* LEFT SIDE - INFO */}
    <div className="contact-info">

      <h2 className="section-title custom-heading">contact us</h2>
      <h2>Let's Get in Touch</h2>

      <div className="info-box">
        <span>📧</span>
        <div>
          <h4>Email Address</h4>
          <p>karmaas.in@gmail.com</p>
        </div>
      </div>

      <div className="info-box">
        <span>📞</span>
        <div>
          <h4>Call Us</h4>
          <p>+91-97525 04406</p>
        </div>
      </div>

      <div className="info-box">
        <span>📍</span>
        <div>
          <h4>Address</h4>
          <p>H-83, Ravindra Nagar, Khargone, MP 451001</p>
        </div>
      </div>

      {/* Google Map */}
      <div className="map-box">
        <iframe
          src="https://maps.google.com/maps?q=Khargone%20Madhya%20Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          title="map"
        ></iframe>
      </div>

    </div>

    {/* RIGHT SIDE - FORM */}
    <div className="contact-form-box">
      <form onSubmit={handleSubmit}>

        <h3>Send Message</h3>

        <input name="name" placeholder="Your Name" required />
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="phone" placeholder="Phone Number" />
        <textarea name="message" placeholder="Your Message" required />

        <input type="text" name="hidden" style={{ display: "none" }} />

        <button type="submit">Send Message</button>

      </form>
    </div>

    {/* Popup */}
    {success && (
      <div className="popup-overlay">
        <div className="popup-box">
          <h3>✅ Message Sent</h3>
          <p>We will contact you soon.</p>
          <button onClick={() => setSuccess(false)}>Close</button>
        </div>
      </div>
    )}
  </div>
  <Footer/>
  </>
);
}