import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const forgotPasswordRedirect = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async () => {
    try {
      const loginResponse = await fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Received response from server:", loginResponse);

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text(); 
        console.error("Login Failed:", errorText);
        setError("Login failed. Check your email and password.");
        return;
      }

      const loginData = await loginResponse.json();
      console.log("Parsed login data:", loginData);

      try {
        localStorage.setItem("role", loginData.role);
        console.log("Login successful, role stored:", loginData.role);
      } catch (storageError) {
        console.error("LocalStorage Error:", storageError);
        setError("Storage error. Try again in normal mode.");
      }

      navigate(loginData.role === "seller" ? "/sellerstores" : "/");
    } catch (error) {
      console.error("Network/Login Error:", error);
      setError("Something went wrong. Please check your internet connection.");
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>Log in to Your Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button
          className="forgot-password"
          onClick={forgotPasswordRedirect}
          style={{
            background: "none",
            border: "none",
            color: "skyblue",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "1rem",
          }}
        >
          Forgot your password?
        </button>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/sign-up" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
