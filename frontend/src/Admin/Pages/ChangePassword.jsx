import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../AdminLayout";
import PasswordInput from "../../componenets/PasswordInput";

export default function ChangePassword() {

  const baseURL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    if (
      formData.newPassword.length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {

      setLoading(true);

      const res = await axios.put(
        `${baseURL}/api/auth/change-password`,
        {
          oldPassword:
            formData.oldPassword,
          newPassword:
            formData.newPassword
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem(
                "token"
              )}`
          }
        }
      );

      toast.success(
        "Password updated successfully. Please login again."
      );

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setTimeout(() => {

        window.location.href =
          "/login";

      }, 2000);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Password change failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <AdminLayout>

      <div
        className="container-fluid"
        style={{
          minHeight: "100vh",
          background:
            "var(--bg-light)",
          padding: "40px 20px"
        }}
      >

        <div className="row justify-content-center">

          <div className="col-lg-5 col-md-7">

            <div
              className="card border-0"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)"
              }}
            >

              {/* HEADER */}
              <div
                style={{
                  background:
                    "var(--primary-green)",
                  color: "white",
                  padding: "25px",
                  textAlign: "center"
                }}
              >

                <h3
                  style={{
                    margin: 0,
                    fontWeight: "700"
                  }}
                >
                  🔐 Change Password
                </h3>

                <p
                  style={{
                    marginTop: "8px",
                    opacity: 0.9
                  }}
                >
                  Keep your account secure
                </p>

              </div>


              {/* BODY */}
              <div
                className="card-body"
                style={{
                  padding: "35px"
                }}
              >

                <form
                  onSubmit={handleSubmit}
                >

                  <PasswordInput
                    label="Old Password"
                    name="oldPassword"
                    value={
                      formData.oldPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter old password"
                    required
                  />

                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    value={
                      formData.newPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter new password"
                    required
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Confirm new password"
                    required
                  />


                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 mt-3"
                    style={{
                      background:
                        "var(--primary-green)",
                      color: "white",
                      border: "none",
                      borderRadius:
                        "12px",
                      padding: "12px",
                      fontWeight: "600",
                      fontSize: "16px"
                    }}
                  >

                    {loading
                      ? "Updating..."
                      : "Update Password"}

                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}