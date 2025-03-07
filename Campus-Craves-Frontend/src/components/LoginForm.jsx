import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import Header from "./Header";

const LoginForm = ({ title = "Login/SignUp", showStoreId, storeId, setStoreId }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (showStoreId) {
      navigate("/productsview"); // Redirect to Products View for sellers
    } else {
      navigate("/"); // Redirect to Home page for buyers
    }
  };

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>{title}</h2>
        <p>
          Log In as <Link to="/buyer-login" className="login-link">Buyer</Link> | <Link to="/seller-login" className="login-link">Seller</Link>
        </p>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        {showStoreId && (
          <input
            type="text"
            placeholder="Store ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
        )}

        <button className="login-button" onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?{" "}
          <Link to="/sign-up" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
