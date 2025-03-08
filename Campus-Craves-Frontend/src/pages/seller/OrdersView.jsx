import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./OrdersView.css";

const OrdersView = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
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
      status: "Order Received",
      canteen: "Hall 5",
    },
    {
      id: 2,
      items: [{ name: "Pasta", quantity: 1, price: 250 }],
      total: 250,
      date: "Feb 10, 2022 18:30",
      address: "B-12, Student Block",
      payment: "Card",
      status: "Order Received",
      canteen: "Hall 6",
    },
    {
      id: 3,
      items: [
        { name: "Sandwich", quantity: 3, price: 150 },
        { name: "Juice", quantity: 2, price: 100 },
      ],
      total: 250,
      date: "Mar 15, 2022 12:45",
      address: "C-101, Hall of Residence 2",
      payment: "Cash",
      status: "Order Received",
      canteen: "Hall 7",
    },
    {
      id: 4,
      items: [{ name: "Salad", quantity: 1, price: 120 }],
      total: 120,
      date: "Apr 05, 2022 10:20",
      address: "D-202, Hall of Residence 3",
      payment: "Card",
      status: "Order Received",
      canteen: "Hall 8",
    },
    {
      id: 5,
      items: [
        { name: "Fries", quantity: 2, price: 80 },
        { name: "Soda", quantity: 1, price: 50 },
      ],
      total: 130,
      date: "May 12, 2022 16:30",
      address: "E-303, Hall of Residence 4",
      payment: "Cash",
      status: "Order Received",
      canteen: "Hall 9",
    },
    {
      id: 6,
      items: [{ name: "Ice Cream", quantity: 2, price: 200 }],
      total: 200,
      date: "Jun 18, 2022 14:50",
      address: "F-404, Hall of Residence 5",
      payment: "Card",
      status: "Order Received",
      canteen: "Hall 10",
    },
    {
      id: 7,
      items: [
        { name: "Noodles", quantity: 1, price: 150 },
        { name: "Soup", quantity: 1, price: 100 },
      ],
      total: 250,
      date: "Jul 22, 2022 19:15",
      address: "G-505, Hall of Residence 6",
      payment: "Cash",
      status: "Order Received",
      canteen: "Hall 11",
    },
  ]);

  const updateStatus = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const statusOrder = ["Order Accepted", "Preparing", "Out for Delivery", "Delivered"];
          const currentStatusIndex = statusOrder.indexOf(order.status);
          const nextStatusIndex = (currentStatusIndex + 1) % statusOrder.length;
          return { ...order, status: statusOrder[nextStatusIndex] };
        }
        return order;
      })
    );
  };

  const acceptOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "Order Accepted" };
        }
        return order;
      })
    );
  };

  const rejectOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: "Order Rejected" };
        }
        return order;
      })
    );
  };

  return (
    <div className="order-history-container">
      {/* Top Navigation */}
      <div className="top-bar">
        <h1 className="website-name" onClick={() => navigate("/")}>
          CampusCrave
        </h1>
        <input
          type="text"
          placeholder="Search for order"
          className="search-box"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="button-container">
        <button onClick={() => navigate("/categoriesview")} className="nav-button orders-button">
          Categories
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
            <p className="order-info"><strong>Canteen:</strong> {order.canteen}</p>
            <p className={`order-status ${order.status.toLowerCase().replace(/ /g, '-')}`}>
              <strong>Order Status:</strong> {order.status}
            </p>
            {order.status === "Order Received" ? (
              <>
                <button onClick={() => acceptOrder(order.id)} className="accept-order-button">
                  Accept
                </button>
                <button onClick={() => rejectOrder(order.id)} className="reject-order-button">
                  Reject
                </button>
              </>
            ) : order.status !== "Order Rejected" ? (
              <button onClick={() => updateStatus(order.id)} className="update-status-button">
                Update Status
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersView;
