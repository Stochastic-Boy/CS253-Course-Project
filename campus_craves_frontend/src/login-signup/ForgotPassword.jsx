import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../reduxfeatures/userSlice";
import "./Forms.css";
import Header from "../components/Header";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContinue = async () => {
    dispatch(loginStart());
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email.");
      dispatch(loginFailure("Please enter your email."));
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/users/send-otp/", { email });
      setSuccessMessage("Check your email for reset instructions.");
      dispatch(loginSuccess(response.data));
      
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data || error);
      setError(error.response?.data?.error || "Something went wrong. Please try again.");
      dispatch(loginFailure(error.response?.data?.error || "Something went wrong."));
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
          name="email"
          value={email}
          onChange={handleChange}
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

