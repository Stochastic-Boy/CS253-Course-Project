import React, { useEffect, useState } from "react";
import axios from "axios";
import './Ordersview.css';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/sellerorders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching seller orders", err);
    }
  };

  // const markDelivered = async (orderId) => {
  //   try {
  //     const res = await axios.post(`http://127.0.0.1:8000/orders/deliver/${orderId}/`, {}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setMessage(res.data.message);
  //     fetchSellerOrders();
  //   } catch (err) {
  //     console.error("Error marking delivered", err);
  //   }
  // };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Store Orders</h2>
      {message && <p className="text-green-600">{message}</p>}
      <div className="seller-orders">
      {orders.map((order) => (
        <div key={order.id} className="seller-orders-card border rounded p-3 mb-4">
          <div className="orders-h1">
            <p className="font-semibold">Order Number: {order.id}</p>
            <h5 style={{color: order.status==='delivered' ? "green" : order.status==='pending' ? "rgb(255, 255, 0)" : "red"}}>{order.status}</h5>
          </div>  
          <p>Buyer: {order.user}</p>
          <p>Payment: {order.payment_method}</p>
          <p>Total: ₹{order.total_price}</p>
          <p>Address: {order.delivery_address}</p>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>

          <ul className="ml-4 mt-2">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.product_details.name} × {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>

          {/* {order.status !== "delivered" && order.status !== "cancelled" && (
            <button
              onClick={() => markDelivered(order.id)}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            >
              Mark as Delivered
            </button>
          )} */}
        </div>
      ))}
      </div>
    </div>
  );
};

export default OrdersView;
