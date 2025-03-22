import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Forms.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!username || !email || !password || !role) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/signup-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/confirm-signup", { state: { email, role, username, password } });
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Sign-up error:", err);
    }
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>Create New Account</h2>

        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        {/* Dropdown for Role instead of free text */}
        <select value={role} onChange={(e) => setRole(e.target.value)} 
        style={{ borderRadius: "5px", padding: "8px", marginBottom: "15px", width: "100%"}} >
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      
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
