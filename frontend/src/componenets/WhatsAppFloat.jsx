import React from "react";
import "../styles/whatsapp-float.css";

export default function WhatsAppFloat() {
  const phone ="919752504406"; // replace with your number

  const message = encodeURIComponent(
    "Hi Karmaass, I want to know more about your products."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      className="wa-float-btn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="wa-icon">💬</span>
    </a>
  );
}