import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../reduxfeatures/userSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") setOTP(value);
    if (name === "newPassword") setNewPassword(value);
  };

  const handleResetPassword = async () => {
    dispatch(loginStart());
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is missing. Please go back and try again.");
      dispatch(loginFailure("Email is missing."));
      return;
    }

    if (!otp) {
      setError("Please enter the OTP.");
      dispatch(loginFailure("OTP is missing."));
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setError("Invalid OTP format. It should be numeric.");
      dispatch(loginFailure("Invalid OTP format."));
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      dispatch(loginFailure("Password too short."));
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/users/reset-password/", { email, otp, newPassword });
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      dispatch(loginSuccess(response.data));

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error);
      setError(error.response?.data?.error || "Something went wrong. Please try again.");
      dispatch(loginFailure(error.response?.data?.error || "Reset password failed."));
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>Reset Your Password</h2>

        <input type="email" value={email} disabled />

        <input type="text" name="otp" placeholder="Enter OTP" value={otp} onChange={handleChange} required />
        
        <input type="password" name="newPassword" placeholder="New Password" value={newPassword} onChange={handleChange} required />

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button className="login-button" onClick={handleResetPassword}>Reset Password</button>

        <p>
          <Link to="/login" className="login-link" style={{ fontSize: "1rem" }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
