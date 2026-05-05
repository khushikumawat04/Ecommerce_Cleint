// components/Loading.jsx
import React from "react";
import "../styles/loading.css";

function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default Loading;