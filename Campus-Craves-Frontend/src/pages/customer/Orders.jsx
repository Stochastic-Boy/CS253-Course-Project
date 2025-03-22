import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyOrders, setShowMyOrders] = useState(false);

  const loggedInUsername = localStorage.getItem("username");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/orders/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }); 

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter orders based on logged-in user when "Your Orders" is clicked
  const displayedOrders = showMyOrders
    ? orders.filter((order) => order.buyer === loggedInUsername)
    : orders;

  return (
    <div className="order-history-container">
      <div className="top-bar">
        <h1 className="website-name" onClick={() => navigate("/")}>
          CampusCrave
        </h1>
      </div>

      <div className="button-container">
        <button
          onClick={() => setShowMyOrders(false)}
          className={`nav-button ${!showMyOrders ? "active" : ""}`}
        >
          All Orders
        </button>
        <button
          onClick={() => setShowMyOrders(true)}
          className={`nav-button ${showMyOrders ? "active" : ""}`}
        >
          Your Orders
        </button>
        <button onClick={() => navigate("/")} className="nav-button home-button">
          Go to Home Page
        </button>
      </div>

      <div className="order-grid">
        {displayedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          displayedOrders.map(({ id, created_at, items, total_amount, delivery_address, payment_method, store, status }) => (
            <div key={id} className="order-card">
              <div className="order-header">
                <h2 className="order-id">Order #{id}</h2>
                <span className="order-date">{new Date(created_at).toLocaleString()}</span>
              </div>
              <div className="order-items">
                {items.map(({ product_name, quantity, price }, index) => (
                  <p key={index} className="order-item">
                    <strong>{quantity} x {product_name}</strong> <span>Rs. {price}</span>
                  </p>
                ))}
              </div>
              <p className="order-total"><strong>Total:</strong> <span>Rs. {total_amount}</span></p>
              <p className="order-info"><strong>Delivery Address:</strong> {delivery_address}</p>
              <p className="order-info"><strong>Paid by:</strong> {payment_method}</p>
              <p className="order-info"><strong>Canteen:</strong> {store.name}</p>
              <p className={`order-status ${status.toLowerCase()}`}>
                <strong>Order Status:</strong> {status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
