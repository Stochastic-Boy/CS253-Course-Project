import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({email:"", password:""})
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const loginResponse = await axios.post("http://127.0.0.1:8000/users/login/", data);

      // Check if the response contains the expected data
      if (loginResponse.data && loginResponse.data.role) {
        localStorage.setItem("role", loginResponse.data.role); // Store role in localStorage

        // Redirect based on role
        if (loginResponse.data.role === "seller") {
          navigate("/sellerstores");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      // Handle errors from the server
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Login failed. Please check your credentials.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login Error:", error);
    }
  };

  const handleChange=(e)=> {
    setData({...data, [e.target.name]:e.target.value});
  }

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>{"Log in to Your Account"}</h2>

        <input type="email" placeholder="Email" name="email" value={data.email} onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" value={data.password} onChange={handleChange} />

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
