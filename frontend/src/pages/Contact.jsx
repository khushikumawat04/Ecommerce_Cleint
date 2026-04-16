import React, { useState } from "react";
import "../styles/contact.css";

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
    <div className="contact-wrapper">

      <form onSubmit={handleSubmit} className="contact-card">

        <h2>Contact Us</h2>

        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone" />
        <textarea name="message" placeholder="Message" required />

        {/* Anti-spam */}
        <input type="text" name="hidden" style={{ display: "none" }} />

        <button type="submit">Send</button>
      </form>

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
  );
}