import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter password",
  required = false
}) {

  const [showPassword, setShowPassword] =
    useState(false);

  return (

    <div className="mb-3">

      {label && (
        <label className="form-label fw-semibold">
          {label}
        </label>
      )}

      <div className="position-relative">

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            height: "50px",
            borderRadius: "12px",
            paddingRight: "50px"
          }}
        />

        <span
          onClick={() =>
            setShowPassword(!showPassword)
          }
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform:
              "translateY(-50%)",
            cursor: "pointer",
            fontSize: "20px",
            color: "#666"
          }}
        >

          {showPassword
            ? <FiEyeOff />
            : <FiEye />}

        </span>

      </div>

    </div>

  );

}