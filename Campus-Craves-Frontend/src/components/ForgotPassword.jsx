import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const navigate = useNavigate();

  const handleContinue = async () => {
    setError(""); 
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessMessage("Check your email for reset instructions."); 

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000); 
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Forgot Password Error:", error);
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>Forgot Your Password?</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} 
        <button className="login-button" onClick={handleContinue}>
          Continue
        </button>

        <p>
          <Link to="/login" className="login-link">
            Return to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
