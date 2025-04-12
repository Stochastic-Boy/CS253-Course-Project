import React, { useEffect, useState } from "react";
import axios from "axios";
import './OrdersView.css';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(10);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/sellerorders/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      setOrders(res.data);

      const buyerIds = [...new Set(res.data.map(order => order.user))];

      const buyersData = await Promise.all(
        buyerIds.map((id) => 
          axios.get(`http://127.0.0.1:8000/users/${id}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }).then(response => response.data)
        )
      );
  
      const buyerMap = {};
      buyersData.forEach((buyer) => {
        buyerMap[buyer.user.id] = buyer;
      });
  
      const ordersWithBuyers = res.data.map((order) => ({
        ...order,
        buyer: buyerMap[order.user] || null, 
      }));
  
      setOrders(ordersWithBuyers);
     
    }catch (err) {
      console.error("Error fetching seller orders", err);
    }
  };
  
  // Helper function to display product name, handling deleted products
  const getProductName = (item) => {
    if (item.product_details) {
      return item.product_details.name;
    } else if (item.product_info) {
      return `${item.product_info.name} (deleted)`;
    }
    return "Product no longer available";
  };
  
  // Helper function to calculate item price, handling deleted products
  const getItemPrice = (item) => {
    const price = item.product_details ? item.product_details.price : (item.product_info ? item.product_info.price : item.price);
    return price * item.quantity;
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Store Orders</h2>
      <div className="seller-orders">

       {orders.slice(0, visibleOrders).map((order) => (
        <div key={order.id} className="seller-orders-card border rounded p-3 mb-4">
          <div className="orders-h1">
            <div className="font-semibold">Order Number: {order.id}</div>
            <h5 style={{color: order.status==='delivered' ? "rgb(59, 255, 108)" : order.status==='pending' ? "rgb(255, 255, 0)" : "rgb(255, 53, 53)"}}>{order.status}</h5>
          </div>  
          <div>Buyer: {order?.buyer?.user?.username}</div>
          <div>Contact: {order?.buyer?.profile?.phone_number}</div>
          <div>Payment: {order.payment_method}</div>
          <div>Total: ₹{order.total_price}</div>
          <div>Address: {order.delivery_address}</div>
          <div>Date: {new Date(order.created_at).toLocaleString()}</div>

          <h5 className="font-semibold mt-4">Items:</h5>
          <ul className="ml-4 mt-2">
            {order.items.map((item) => (
              <li style={{color: "rgb(111, 255, 250)"}} key={item.id}>
                {getProductName(item)} × {item.quantity} = ₹{getItemPrice(item)}
              </li>
            ))}
          </ul>

        </div>
       ))}
      </div>

    {orders.length > visibleOrders && (
      <div className="text-center my-4">
        <button
          onClick={() => setVisibleOrders((prev) => prev + 10)}
          className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
        >
          View More
        </button>
      </div>
    )}
    </div>
  );
};

export default OrdersView;