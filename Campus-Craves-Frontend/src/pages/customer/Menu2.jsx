import { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import "./Menu.css";

const Menu = () => {
  const [categories, setCategories] = useState([]);  
  const [selectedCategory, setSelectedCategory] = useState("");  
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState({});

  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/products/categories/")  
      .then((response) => {
        setCategories(response.data);  
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].name);  // Store only the name
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="orgmenu">
      <Header />
      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Categories</h2>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <button
                key={index}
                className={selectedCategory === category.name ? "active" : ""}
                onClick={() => setSelectedCategory(category.name)}  // Store name, not object
              >
                {category.name}
              </button>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </aside>

        {/* Main Content */}
        <div className="content">
          <h2>{selectedCategory ?? "Select a category"}</h2>
        </div>
      </div>
    </div>
  );
};

export default Menu;
