import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const loginResponse = await fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.error || "Login failed.");
        return;
      }

      localStorage.setItem("role", loginData.role);
      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("refresh_token", loginData.refresh);
      localStorage.setItem("user", JSON.stringify(loginData.user || { email }));

      // Redirect based on role
      if (loginData.role === "seller") {
        navigate("/sellerstores");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>{"Log in to Your Account"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-message">{error}</p>}

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

export default Login;
