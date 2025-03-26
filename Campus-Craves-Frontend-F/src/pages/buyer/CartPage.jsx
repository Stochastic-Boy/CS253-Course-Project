import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { storeId } = useParams(); 
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    fetchCart();
  }, [storeId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/cart/${storeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/item/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Item removed.");
      fetchCart();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/clear/${storeId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(null);
      setMessage("Cart cleared.");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error clearing cart:", err.response?.data || err.message);
    }
  };

  const totalPrice = cart ? cart.total_price : 0;

  if (!cart) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Cart (Store #{storeId})</h2>
        <p>Your cart is empty or missing data.</p>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Your Cart (Store #{storeId})
      </h2>
      {message && <p className="text-green-600">{message}</p>}
      {cart.items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul className="mb-4">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <p>{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  Price: ₹{item.product_price} | Qty: {item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="bg-red-500 text-white px-2 py-1 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg">Total: ₹{totalPrice}</h3>
        <button
          onClick={handleClearCart}
          className="bg-gray-500 text-white px-3 py-1 text-sm"
        >
          Clear Cart
        </button>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={() => navigate(`/checkout/${storeId}`)}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
