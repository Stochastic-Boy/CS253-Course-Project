import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import "./Forms.css";

const ConfirmSignup = () => {
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOTP] = useState("");

  // Prevent crashes if location.state is undefined
  const email = location.state?.email || "";
  const role = location.state?.role || "";
  const username = location.state?.username || "";
  const password = location.state?.password || "";

  const handleResend = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/signup-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("OTP sent successfully:", data);
      } else {
        setError(data.error || "OTP resend failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      // First, verify the OTP
      const otpResponse = await fetch("http://localhost:8000/users/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const otpData = await otpResponse.json();
      if (!otpResponse.ok) {
        setError(otpData.error || "OTP verification failed.");
        return;
      }

      console.log("OTP verified successfully:", otpData);

      // Now, proceed with user registration
      const signupResponse = await fetch("http://localhost:8000/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const signupData = await signupResponse.json();
      if (signupResponse.ok) {
        console.log("User registered successfully:", signupData);

        // Redirect based on role
        if(role === "seller") {
          navigate("/sellerstores");
        } else {
            navigate("/");
        }
      } else {
        setError(signupData.error || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>Verify OTP</h2>
        <h6>Enter the OTP sent to your registered email</h6>
        <h5>{email}</h5>

        {/* OTP should be a number */}
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
          Didn't receive the email? {""}
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