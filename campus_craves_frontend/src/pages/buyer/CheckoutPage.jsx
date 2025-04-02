import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success("Order placed successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
  
        setTimeout(() => navigate("/order"), 3000);
      } else {
        toast.error(data.error || "Order placement failed.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Order placement error:", error);
    }
  };

  const handlePayment = () => {
    console.log(userDetails);
    if (paymentMethod === "razorpay") {
      if (!window.Razorpay) {
        setMessage("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: "rzp_test_g0MMzyeHhMKtnq",
        amount: newCart.total_price * 100, 
        currency: "INR",
        name: "Canteen Automation",
        description: "Order Payment",
        handler: function (response) {
          setMessage("Payment Successful: " + response.razorpay_payment_id);
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
    }  else {
      setMessage("Order placed with Cash on Delivery");
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
      {message && (<p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
        {message}
      </p>)}

    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
      <button
        onClick={handlePayment}
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "4.5px", 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
          transition: "all 0.2s ease-in-out", 
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#111")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#222")}
      >
        Confirm Order
      </button>

      <button
        onClick={() => navigate(`/menu/${storeId}`)}
        style={{
          backgroundColor: "#ff6600",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "4.5px", 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
          transition: "all 0.2s ease-in-out", 
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e65c00")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6600")}
      >
        Back to Cart
      </button>
   </div>
     <ToastContainer/>
  </div>
  </div>
  );
};

export default Checkout;