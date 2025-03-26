import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  // Matches /menu/:storeId in your routes
  const { storeId } = useParams();
  const navigate = useNavigate();
  // Buyer must be logged in to add items to cart
  const accessToken = localStorage.getItem("access_token");

  // State for store categories, selected category, products, etc.
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  // Fetch all categories for the given store once storeId is available
  useEffect(() => {
    if (!storeId) return;
    fetchCategories();
  }, [storeId]);

  // 1) Load categories via: GET /products/public/categories/<store_id>/
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/products/public/categories/${storeId}/`);
      setCategories(res.data); // Save them in state
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
    }
  };

  // 2) Load products in a selected category via: GET /products/public/products/<store_id>/<category_id>/
  const fetchProducts = async (categoryId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/public/products/${storeId}/${categoryId}/`
      );
      setProducts(res.data);
      setSelectedCategory(categoryId);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    }
  };

  // 3) Add a product to cart, requires a valid JWT
  const handleAddToCart = async (productId) => {
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }

    // Default to quantity=1 if none is set
    const quantity = quantities[productId] || 1;
    try {
      await axios.post(
        "http://127.0.0.1:8000/cart/add/",
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
      navigate(`/cart/${storeId}`);
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>

      {message && <p className="text-green-600">{message}</p>}

      {/* Category List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        {/* If no categories found, show a message */}
        {categories.length === 0 ? (
          <p>No categories found for this store.</p>
        ) : (
          <ul className="pl-4">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`cursor-pointer py-1 ${
                  selectedCategory === cat.id ? "font-bold text-blue-600" : ""
                }`}
                onClick={() => fetchProducts(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Products for Selected Category */}
      {selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Products</h3>
          {products.length === 0 ? (
            <p>No products found in this category.</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id} className="flex justify-between items-center mb-3">
                  <div>
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="1"
                      className="w-16 border px-1"
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [product.id]: parseInt(e.target.value),
                        })
                      }
                    />
                    <button
                      className="bg-blue-500 text-white px-2 py-1 text-sm"
                      onClick={() => handleAddToCart(product.id)}
      
                    >
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
