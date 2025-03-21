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
    const response = await fetch("http://localhost:8000/users/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("User registered successfully:", data);
      
      if (role === "seller") {
        navigate("/login");
      } else {
        navigate("/login");
      }
    } else {
      setError(data.error || "Registration failed.");
    }
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>{"Create New Account"}</h2>

        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <select class ="role-dropdown" value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

      

        {error && <p className="error">{error}</p>}

        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>

        <p>
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
