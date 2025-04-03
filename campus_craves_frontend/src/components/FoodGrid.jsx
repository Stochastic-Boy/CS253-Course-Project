import "./FoodGrid.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const FoodGrid = () => {
  const [stores, setStores] = useState([]); 
  const [visibleItems, setVisibleItems] = useState(10); 
  const [columns, setColumns] = useState(5); 
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:8000/stores/") 
      .then(response => response.json())  
      .then(data => 
        setStores(data))  
      .catch(error => console.error("Error fetching stores:", error));  
  }, []);

  useEffect(() => {
    const updateGridSize = () => {
      let cols = 5; 

      if (window.innerWidth <= 1200) cols = 4; // Medium screens
      if (window.innerWidth <= 992) cols = 3; // Tablets
      if (window.innerWidth <= 768) cols = 2; // Mobile landscape
      if (window.innerWidth <= 480) cols = 1; // Mobile portrait

      setColumns(cols);

      const totalItems = stores.length;
      const maxVisible = Math.min(totalItems, Math.ceil(totalItems / cols) * cols);
      setVisibleItems(Math.min(maxVisible, cols * 2));
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);

    return () => window.removeEventListener("resize", updateGridSize);
  }, [stores]); 

  return (
    <div className="food-grid-container">
      <div className="food-grid">
        {stores.slice(0, visibleItems).map((store) => (
          <div 
            key={store.id} 
            className="food-item" 
            onClick={() => navigate(`/menu/${store.id}`)} 
            style={{ cursor: "pointer" }} 
          >
            <img src={store.image || "/assets/canteenimg.png"} alt={store.name} className="food-image" />
            <div className="food-name">
              <h4>{store.name}</h4>
            </div>
          </div>
        ))}
      </div>
      {visibleItems < stores.length && (
        <button className="read-more" onClick={() => setVisibleItems(stores.length)}>View More</button>
      )}
    </div>
  );
};

export default FoodGrid;
