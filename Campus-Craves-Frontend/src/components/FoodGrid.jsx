import "./FoodGrid.css";
import { useState } from "react";

const foodItems = [
  { id: 1, image: "src/assets/canteenimg.png", name: "Hall 5", type: "Canteen",open_till:"3:00 AM" },
  { id: 2, image: "src/assets/canteenimg.png", name: "Canteen B", type: "Canteen",open_till:"3:00 AM" },
  { id: 3, image: "src/assets/canteenimg.png", name: "Canteen C", type: "Canteen",open_till:"3:00 AM" },
  { id: 4, image: "src/assets/canteenimg.png", name: "Canteen D", type: "Canteen",open_till:"3:00 AM" },
  { id: 5, image: "src/assets/canteenimg.png", name: "Canteen E", type: "Canteen",open_till:"3:00 AM" },
  { id: 6, image: "src/assets/canteenimg.png", name: "Canteen F", type: "Canteen",open_till:"3:00 AM" },
  { id: 7, image: "src/assets/canteenimg.png", name: "Canteen G", type: "Canteen",open_till:"3:00 AM" },
  { id: 8, image: "src/assets/canteenimg.png", name: "Canteen H", type: "Canteen",open_till:"3:00 AM" },
  { id: 9, image: "src/assets/canteenimg.png", name: "Canteen I", type: "Canteen",open_till:"3:00 AM" },
  { id: 10, image: "src/assets/canteenimg.png", name: "Canteen J", type: "Canteen",open_till:"3:00 AM" },
  { id: 11, image: "src/assets/canteenimg.png", name: "Canteen K", type: "Canteen",open_till:"3:00 AM" },
  { id: 12, image: "src/assets/canteenimg.png", name: "Canteen L", type: "Canteen",open_till:"3:00 AM" },
];

const FoodGrid = () => {
  const [visibleItems, setVisibleItems] = useState(6);
  return (
    <div className="food-grid-container">
      <div className="food-grid">
        {foodItems.slice(0, visibleItems).map((item) => (
          <div key={item.id} className="food-item">
            <img src={item.image} alt={item.name} className="food-image" />
            <p className="food-name">
              <h5 style={{color:"orange", marginBottom:0}}>{item.type}</h5>
              <h4>{item.name}</h4>
              </p>
              <div className="open">
                <img src="src\assets\Clock.png" alt="Clock Icon" className="clock" />
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