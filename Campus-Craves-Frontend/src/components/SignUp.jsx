import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Forms.css";

const SignUp = ({ role, title = "Create New Account" }) => {
  const [storeId, setStoreId] = useState(""); // Store ID for Seller
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (role === "seller") {
      navigate("/productsview"); // Redirect to Products View for sellers
    } else {
      navigate("/"); // Redirect to Home page for buyers
    }
  };

  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>{title}</h2>
        Sign Up as <Link to="/buyer-signup" className="signup-link">Buyer</Link> | <Link to="/seller-signup" className="signup-link">Seller</Link>
        
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        {role === "seller" && (
          <input
            type="text"
            placeholder="Store ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
        )}

        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
        
        <p>
          Already have an account?{" "} 
          <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
