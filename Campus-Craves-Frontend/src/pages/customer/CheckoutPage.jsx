import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Checkout = ({ deliveryAddress = "Hall 2, IIT Kanpur" }) => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    document.body.appendChild(script);
  }, []);

  const items = [
    { name: "Paneer Tikka", price: 120, quantity: 1 },
    { name: "Margherita Pizza", price: 200, quantity: 5 },
    { name: "Hakka Noodles", price: 110, quantity: 1 },
  ];

  const computedTotalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async (method) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          store_id: storeId,
          payment_method: method,
          delivery_address: deliveryAddress,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Order placed successfully!");
        setTimeout(() => navigate("/order"), 2000); // Redirect after 2s
      } else {
        setMessage(data.error || "Order placement failed.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      setMessage("Something went wrong while placing the order.");
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: "rzp_test_g0MMzyeHhMKtnq",
        amount: computedTotalAmount * 100,
        currency: "INR",
        name: "Canteen Automation",
        description: "Order Payment",
        handler: function (response) {
          alert("Payment Successful: " + response.razorpay_payment_id);
          placeOrder("razorpay");
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#ff6600" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Order placed with Cash on Delivery");
      placeOrder("CoD");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ borderBottom: "2px solid #ff6600", paddingBottom: "10px" }}>Checkout</h2>

      <div>
        {items.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}
          >
            <span>{item.name}</span>
            <span>₹{item.price} x {item.quantity}</span>
          </div>
        ))}
        <h3 style={{ marginTop: "20px" }}>Total: ₹{computedTotalAmount}</h3>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Select Payment Method</h3>
        <label>
          <input
            type="radio"
            value="razorpay"
            checked={paymentMethod === "razorpay"}
            onChange={() => setPaymentMethod("razorpay")}
          /> Razorpay
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          /> Cash on Delivery
        </label>
      </div>

      <button
        onClick={handlePayment}
        style={{
          marginTop: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Confirm Order
      </button>

      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
    </div>
  );
};

export default Checkout;