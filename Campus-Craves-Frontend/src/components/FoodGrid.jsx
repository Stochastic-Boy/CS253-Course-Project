import "./FoodGrid.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const foodItems = [
  { id: 1, image: "/assets/canteenimg.png", name: "Hall 5", type: "Canteen", open_till: "3:00 AM" },
  { id: 2, image: "/assets/canteenimg.png", name: "Canteen B", type: "Canteen", open_till: "3:00 AM" },
  { id: 3, image: "/assets/canteenimg.png", name: "Canteen C", type: "Canteen", open_till: "3:00 AM" },
  { id: 4, image: "/assets/canteenimg.png", name: "Canteen D", type: "Canteen", open_till: "3:00 AM" },
  { id: 5, image: "/assets/canteenimg.png", name: "Canteen E", type: "Canteen", open_till: "3:00 AM" },
  { id: 6, image: "/assets/canteenimg.png", name: "Canteen F", type: "Canteen", open_till: "3:00 AM" },
  { id: 7, image: "/assets/canteenimg.png", name: "Canteen G", type: "Canteen", open_till: "3:00 AM" },
  { id: 8, image: "/assets/canteenimg.png", name: "Canteen H", type: "Canteen", open_till: "3:00 AM" },
  { id: 9, image: "/assets/canteenimg.png", name: "Canteen I", type: "Canteen", open_till: "3:00 AM" },
  { id: 10, image: "/assets/canteenimg.png", name: "Canteen J", type: "Canteen", open_till: "3:00 AM" },
  { id: 11, image: "/assets/canteenimg.png", name: "Canteen K", type: "Canteen", open_till: "3:00 AM" },
  { id: 12, image: "/assets/canteenimg.png", name: "Canteen L", type: "Canteen", open_till: "3:00 AM" },
];

const FoodGrid = () => {
  const [visibleItems, setVisibleItems] = useState(10); // 2 rows of 5 columns
  const [columns, setColumns] = useState(5); // Default: 5 columns
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const updateGridSize = () => {
      let cols = 5; // Default for large screens

      if (window.innerWidth <= 1200) cols = 4; // Medium screens
      if (window.innerWidth <= 992) cols = 3; // Tablets
      if (window.innerWidth <= 768) cols = 2; // Mobile landscape
      if (window.innerWidth <= 480) cols = 1; // Mobile portrait

      setColumns(cols);

      // Ensure both rows are fully filled
      const totalItems = foodItems.length;
      const maxVisible = Math.min(totalItems, Math.ceil(totalItems / cols) * cols);
      setVisibleItems(Math.min(maxVisible, cols * 2));
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);

    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  return (
    <div className="food-grid-container">
      <div className="food-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {foodItems.slice(0, visibleItems).map((item) => (
          <div 
            key={item.id} 
            className="food-item" 
            onClick={() => navigate("/menu")} // Redirects to Menu page
            style={{ cursor: "pointer" }} // Change cursor to indicate clickability
          >
            <img src={item.image} alt={item.name} className="food-image" />
            <div className="food-name">
              <h5 style={{ color: "orange", marginBottom: 0 }}>{item.type}</h5>
              <h4>{item.name}</h4>
            </div>
            <div className="open">
              <img src="/assets/Clock.png" alt="Clock Icon" className="clock" />
              <span>Open until {item.open_till}</span>
            </div>
          </div>
        ))}
      </div>
      {visibleItems < foodItems.length && (
        <button className="read-more" onClick={() => setVisibleItems(foodItems.length)}>View More</button>
      )}
    </div>
  );
};

export default FoodGrid;
