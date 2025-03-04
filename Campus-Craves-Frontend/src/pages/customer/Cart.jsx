import { useNavigate } from "react-router-dom";
import "./cart.css";
// import OrderHistory from "./OrderHistory";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="button-container">
        <button 
          className="your-orders-button" 
          onClick={() => navigate("/order")}
        >
          Your Orders
        </button>
      </div>
    </div>
  );
};

export default Cart;

