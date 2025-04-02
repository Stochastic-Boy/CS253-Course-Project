import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Checkout = () => {
  const user = useSelector((state) => state.user.user);
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [message, setMessage] = useState("");
  const accessToken = localStorage.getItem("access_token");
  const [newCart, setNewCart] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/profile/", {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
  })
      .then((response) => response.json())
      .then((data) => {
          setUserDetails({ id: data.id, phone_number: data.phone_number, address: data.address });
      })
      .catch((error) => {
          console.error("Error fetching user data:", error);
      });

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded");
    document.body.appendChild(script);
  }, []);

  // const items = [
  //   { name: "Paneer Tikka", price: 120, quantity: 1 },
  //   { name: "Margherita Pizza", price: 200, quantity: 5 },
  //   { name: "Hakka Noodles", price: 110, quantity: 1 },
  // ];

  // const computedTotalAmount = items.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

  const placeOrder = async (method) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/orders/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          store_id: storeId,
          payment_method: method,
          delivery_address: userDetails.address || "",
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage("Order placed successfully!");
        setTimeout(() => navigate("/order"), 1000); // Redirect after 2s
      } else {
        setMessage(data.error || "Order placement failed.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      setMessage("Something went wrong while placing the order.");
    }
  };

  const handlePayment = () => {
    console.log(userDetails)
    if (paymentMethod === "razorpay") {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: "rzp_test_g0MMzyeHhMKtnq",
        amount: newCart.total_price * 100, // Amount in paise
        currency: "INR",
        name: "Canteen Automation",
        description: "Order Payment",
        handler: function (response) {
          alert("Payment Successful: " + response.razorpay_payment_id);
          placeOrder("razorpay");
        },
        prefill: {
          name: `${user.username}`,
          email: `${user.email}`,
          contact: `${userDetails?.phone_number}` || "" ,
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



  useEffect(() => {
    if (accessToken && storeId) {
      fetchCart(); 
    }  
  }, []); 

  
  const fetchCart=async()=> { 
    try {
      const res = await axios.get(`http://127.0.0.1:8000/cart/${storeId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(res.data); 
      setNewCart(res.data);
      
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }
  

  return (
    <div className="checkout-container" style={{width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>

    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", width: "40%", backgroundColor: "rgb(150, 251, 255)", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ borderBottom: "2px solid #ff6600", paddingBottom: "10px" }}>Checkout</h2>

      <div>
        {newCart?.items?.length > 0 && (
          <div>
        {newCart.items.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}
          >
            <span>{item.product_name}</span>
            <span>₹{item.product_price} x {item.quantity}</span>
          </div>
        ))}
        </div>
      )}
        <h3 style={{ marginTop: "30px" }}>Total: ₹{newCart.total_price}</h3> 
      </div>

      <div style={{ marginTop: "40px" }}>
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

      <div className="checkout-buttons" style={{display:"flex", gap:"30px"}}>
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

        <button onClick={()=> navigate(`/menu/${storeId}`)}
          style={{
            marginTop: "20px",
            backgroundColor: "rgb(255, 18, 18)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>

      </div>

      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
    </div>
    </div>

  );
};

export default Checkout;