import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signUpFailure, signUpStart } from "../reduxfeatures/userSlice";
import Header from "../components/Header";
import "./Forms.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer", // Default role set to 'buyer'
  });

  const handleSignUp = async () => {
    if (!data.username || !data.email || !data.password) {
      setError("All fields are required!");
      return;
    }

    dispatch(signUpStart());

    try {
      // Step 1: Request OTP
      const res = await axios.post("http://127.0.0.1:8000/users/signup-otp/", { email: data.email });

      if (res.status === 200) {
        // Step 2: Navigate to Confirm Signup page with user details
        navigate("/confirm-signup", { state: { ...data } });
      } else {
        throw new Error("OTP request failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      dispatch(signUpFailure(errorMessage));
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>Create New Account</h2>

        <input type="text" placeholder="Username" name="username" value={data.username} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" value={data.email} onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" value={data.password} onChange={handleChange} />

        {/* Role Selection (Radio Buttons) */}
        <div className="role-selection">
          <label>
            <input type="radio" name="role" value="buyer" checked={data.role === "buyer"} onChange={handleChange} />
            Buyer
          </label>
          <label>
            <input type="radio" name="role" value="seller" checked={data.role === "seller"} onChange={handleChange} />
            Seller
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="signup-button" onClick={handleSignUp}>Verify and Sign Up</button>

        <p>
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
