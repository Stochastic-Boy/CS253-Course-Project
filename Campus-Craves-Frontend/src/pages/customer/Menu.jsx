import { useState } from "react";
import Header from "../../components/Header";
import "./Menu.css";

const categories = ["Paneer", "Wraps", "Whoopers", "Pizzas", "Sandwiches", "Momos", "Noodles", "Pasta"];

const products = {
  Paneer: [
    { id: 1, name: "Paneer Tikka", price: 120 },
    { id: 2, name: "Paneer Butter Masala", price: 150 },
    { id: 3, name: "Paneer Kathi Roll", price: 100 },
    { id: 4, name: "Paneer Pakora", price: 80 },
  ],
  Wraps: [
    { id: 5, name: "Veg Wrap", price: 90 },
    { id: 6, name: "Chicken Wrap", price: 140 },
  ],
  Whoopers: [
    { id: 7, name: "Classic Whooper", price: 160 },
    { id: 8, name: "Cheese Whooper", price: 180 },
  ],
  Pizzas: [
    { id: 9, name: "Margherita Pizza", price: 200 },
    { id: 10, name: "BBQ Chicken Pizza", price: 250 },
    { id: 11, name: "Veggie Supreme", price: 220 },
  ],
  Sandwiches: [
    { id: 12, name: "Grilled Cheese Sandwich", price: 80 },
    { id: 13, name: "Chicken Club Sandwich", price: 150 },
  ],
  Momos: [
    { id: 14, name: "Veg Momos", price: 70 },
    { id: 15, name: "Chicken Momos", price: 120 },
  ],
  Noodles: [
    { id: 16, name: "Hakka Noodles", price: 110 },
    { id: 17, name: "Schezwan Noodles", price: 130 },
  ],
  Pasta: [
    { id: 18, name: "White Sauce Pasta", price: 140 },
    { id: 19, name: "Red Sauce Pasta", price: 130 },
  ],
};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Paneer");
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity || 0) + 1 },
    }));
  };

  const handleQuantityChange = (id, change) => {
    setCart((prev) => {
      const newQuantity = (prev[id]?.quantity || 0) + change;
      if (newQuantity <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...prev[id], quantity: newQuantity } };
    });
  };

  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = searchTerm
    ? Object.values(products).flat().filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products[selectedCategory] || [];

  return (
    <div className="orgmenu">
    <Header/>
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "16px", background: "#f7f7f7" }}>
      <style>
        {`
          @media (min-width: 768px) {
            .layout { display: flex; flex-direction: row; }
            .sidebar { width: 16%; }
            .content { flex: 1; }
            .cart { width: 25%; }
          }
        `}
      </style>
      
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar" style={{ background: "white", padding: "16px", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Categories</h2>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div>
            {categories.map((category) => (
              <button key={category} style={{ display: "block", width: "100%", padding: "8px", textAlign: "left", background: selectedCategory === category ? "#ff6600" : "white", color: selectedCategory === category ? "white" : "black", border: "none", cursor: "pointer" }} onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="content" style={{ padding: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{selectedCategory}</h2>
          <input type="text" placeholder="Search for items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "8px", marginBottom: "16px" }} />
          <div style={{ background: "white", padding: "16px", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
            {filteredProducts.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #ddd" }}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
                <button onClick={() => handleAddToCart(item)} style={{ background: "#ff6600", color: "white", padding: "4px 8px", border: "none", cursor: "pointer" }}>Add</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart */}
        <aside className="cart" style={{ background: "white", padding: "16px", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Items in Cart</h2>
          {Object.values(cart).length > 0 ? (
            Object.values(cart).map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #ddd" }}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => handleQuantityChange(item.id, -1)} style={{ padding: "4px", background: "#ddd", border: "none", cursor: "pointer" }}>-</button>
                  <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} style={{ padding: "4px", background: "#ddd", border: "none", cursor: "pointer" }}>+</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>No items in cart</p>
          )}
          <div style={{ marginTop: "16px", fontWeight: "bold", textAlign: "right" }}>Total: ₹{total}</div>
          <button style={{ width: "100%", background: "black", color: "white", padding: "8px", marginTop: "8px", border: "none", cursor: "pointer" }}>Checkout →</button>
        </aside>
      </div>
    </div>
    </div>
  );
}

export default Menu;


