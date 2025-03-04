import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: 1,
      items: [
        { name: "Pizza", quantity: 2, price: 598 },
        { name: "Burger", quantity: 1, price: 100 },
      ],
      total: 698,
      date: "Jan 23, 2022 14:07",
      address: "E-214, Hall of Residence 1",
      payment: "Cash",
      status: "Preparing",
    },
    {
      id: 2,
      items: [
        { name: "Pasta", quantity: 1, price: 250 },
      ],
      total: 250,
      date: "Feb 10, 2022 18:30",
      address: "B-12, Student Block",
      payment: "Card",
      status: "Delivered",
    },
  ];

  return (
    <div className="order-history-container">
      {/* Top Navigation */}
      <div className="top-bar">
      <h1 className="website-name" onClick={() => navigate("/")}>
          CampusCrave
        </h1>
        <input
          type="text"
          placeholder="Search your order"
          className="search-box"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="button-container">
        <button onClick={() => navigate("/order")} className="nav-button orders-button">
          Your Orders
        </button>
        <button onClick={() => navigate("/")} className="nav-button home-button">
          Go to Home Page
        </button>
      </div>

      {/* Order History Grid */}
      <div className="order-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h2 className="order-id">Order #{order.id}</h2>
              <span className="order-date">{order.date}</span>
            </div>
            {order.items.map((item, index) => (
              <p key={index} className="order-item">
                <strong>{item.quantity} x {item.name}</strong> <span>Rs. {item.price}</span>
              </p>
            ))}
            <p className="order-total"><strong>Total</strong> <span>Rs. {order.total}</span></p>
            <p className="order-info"><strong>Delivery Address:</strong> {order.address}</p>
            <p className="order-info"><strong>Paid by:</strong> {order.payment}</p>
            <p className={`order-status ${order.status.toLowerCase()}`}>
              <strong>Order Status:</strong> {order.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;