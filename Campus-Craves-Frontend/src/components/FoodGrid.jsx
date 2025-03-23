import "./FoodGrid.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const FoodGrid = () => {
  const [stores, setStores] = useState([]); 
  const [visibleItems, setVisibleItems] = useState(10); 
  const [columns, setColumns] = useState(5); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/stores/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        console.log(response.data)
        setStores(response.data); // Update the state with fetched stores
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []); 

  useEffect(() => {
    const updateGridSize = () => {
      let cols = 5; // Default for large screens

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
      <div className="food-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {stores.slice(0, visibleItems).map((store, idx) => (
          
          <div 
            key={idx} 
            className="food-item" 
            onClick={() => navigate("/menu")} 
            style={{ cursor: "pointer" }} 
          >
            <img src={store.image || "/assets/canteenimg.png"} alt={store.name} className="food-image" />
            <div className="food-name">
              {/* <h5 style={{ color: "orange", marginBottom: 2 }}>Canteen</h5> */}
              <h4 style={{ color: "white", marginBottom: 0 }}>{store.name}</h4>
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
