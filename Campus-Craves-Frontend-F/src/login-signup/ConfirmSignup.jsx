import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signUpSuccess, signUpFailure, signUpStart } from "../reduxfeatures/userSlice";
import Header from "../components/Header";
import "./Forms.css";

const ConfirmSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [otp, setOTP] = useState("");

  const email = location.state?.email || "";
  const role = location.state?.role || "";
  const username = location.state?.username || "";
  const password = location.state?.password || "";

  const handleResend = async () => {
    try {
      const res = await axios.post("http://localhost:8000/users/signup-otp/", { email });

      console.log("OTP resent successfully:", res.data);
    } catch (err) {
      console.error("OTP resend failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to resend OTP. Try again.");
    }
  };

  const handleSignUp = async () => {
    if (!otp) {
      setError("OTP is required!");
      return;
    }

    dispatch(signUpStart());

    try {

      await axios.post("http://localhost:8000/users/verify-otp/", { email, otp });

      console.log("OTP verified successfully");

      const res = await axios.post("http://localhost:8000/users/signup/", {
        username,
        email,
        password,
        role,
      });

      console.log("User registered successfully:", res.data);
      dispatch(signUpSuccess(res.data));
      
      const sellerId = res.data?.user.id;
      navigate(role === "seller" ? `/seller/${sellerId}/ordersview` : "/");

    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || "Registration failed. Try again.";
      setError(errorMessage);
      dispatch(signUpFailure(errorMessage));
    }
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>Verify OTP</h2>
        <h6>Enter the OTP sent to your registered email</h6>
        <h5>{email}</h5>
        
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>

        <p>
          Didn't receive the email?{" "}
          <Link onClick={handleResend} className="login-link">Click to resend</Link>
        </p>

        <Link to="/sign-up" className="login-link">
          Back to Signup
        </Link>
      </div>
    </div>
  );
};

export default ConfirmSignup;
