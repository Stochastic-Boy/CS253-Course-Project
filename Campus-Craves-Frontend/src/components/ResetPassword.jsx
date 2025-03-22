import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || ""); 
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setError("Invalid OTP format. It should be numeric.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>Reset Your Password</h2>

        <input
          type="email"
          value={email}
          disabled 
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button className="login-button" onClick={handleResetPassword}>
          Reset Password
        </button>

        <p>
          <Link to="/login" className="login-link" style={{ fontSize: "1rem" }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;