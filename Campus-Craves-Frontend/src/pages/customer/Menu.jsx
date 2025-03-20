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
    ? Object.values(products)
        .flat()
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products[selectedCategory] || [];

  return (
    <div className="orgmenu">
      <Header/>
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row">
      {/* Sidebar for larger screens, Dropdown for mobile */}
      <aside className="w-full md:w-1/6 bg-white p-4 shadow-md mb-4 md:mb-0">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <select
          className="md:hidden w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="hidden md:block">
          {categories.map((category) => (
            <button 
              key={category} 
              className={`block w-full p-2 text-left rounded-md ${selectedCategory === category ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`} 
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">{selectedCategory}</h2>
        <input
          type="text"
          placeholder="Search for items..."
          className="w-full p-2 mb-4 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="bg-white p-4 rounded-md shadow-md">
          {filteredProducts.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b p-2">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <button onClick={() => handleAddToCart(item)} className="bg-orange-500 text-white px-4 py-1 rounded-md">Add</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart */}
      <aside className="w-full md:w-1/4 bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold mb-4">Items in Cart</h2>
        {Object.values(cart).length > 0 ? (
          Object.values(cart).map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b p-2">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(item.id, -1)} className="bg-gray-300 px-2 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)} className="bg-gray-300 px-2 rounded">+</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items in cart</p>
        )}
        <div className="mt-4 font-bold text-right">Total: ₹{total}</div>
        <button className="w-full bg-black text-white p-2 mt-2 rounded-md">Checkout →</button>
      </aside>
    </div>
    </div>
  );
}

export default Menu;
