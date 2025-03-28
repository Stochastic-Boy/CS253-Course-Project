import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/myorders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/orders/cancel/${orderId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order", err);
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/orders/confirm/${orderId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      fetchOrders();
    } catch (err) {
      console.error("Error confirming delivery", err);
    }
  };

  return (
    <div className="orders-page">
      <Header/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {message && <p className="text-green-600">{message}</p>}
      {orders.map((order) => (
        <div key={order.id} className="border rounded p-3 mb-4">
          <p className="font-semibold">Order #{order.id}</p>
          <p>Status: {order.status}</p>
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

          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="mt-2 space-x-2">
              <button style={{backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius:'5px'}}
                onClick={() => cancelOrder(order.id)}
                className="px-3 mx-3 py-1 bg-red-500 text-white rounded"
              >
                Cancel Order
              </button>
              <button style={{backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius:'5px'}}
                onClick={() => confirmDelivery(order.id)}
                className="px-3 mx-3 py-1 bg-green-600 text-white rounded"
              >
                Order Recieved
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
    </div>

  );
};

export default Orders;
