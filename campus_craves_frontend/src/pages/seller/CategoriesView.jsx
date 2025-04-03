import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './categoriesview.css';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  const navigate = useNavigate();
  const { sellerId } = useParams();

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/products/products/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/categories/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [accessToken]);

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setError("Category name is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/products/categories/",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${accessToken}` },
      });
      setCategories([...categories, response.data]);
      setNewCategory({ name: "" });
      setError("");
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Failed to create category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/products/categories/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const toggleCategory = (id) => {
    if (openCategory === id) {
      setOpenCategory(null);
    } else {
      setOpenCategory(id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>

      <div className="mb-4">
        <input
          style={{ width: "40%", border: "none", borderRadius: "5px"}}
          type="text"
          className="border border-gray-400 px-2 py-2 mr-2"
          placeholder="New Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <button 
          style={{ backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius: '5px', margin: "0 10px" }} 
          className="bg-blue-500 text-white px-3 py-2" 
          onClick={handleAddCategory}
        >
          Add Category
        </button>
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>

      <ul>
        {categories.map((category) => (
          <div key={category.id} className="category mb-4">
            <div className="category-product-list mb-1 pb-1 flex justify-between items-center">
              {/*  Added clickable category name with toggle arrow */}
              <span 
                className="categoryName cursor-pointer flex items-center gap-2"
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
                <span className="mx-2">{openCategory === category.id ? "▲" : "▼"}</span>
              </span>

              <div className="category-btns flex gap-2">
                <button 
                  style={{ backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius: '5px' }}
                  onClick={() => navigate(`/seller/${sellerId}/productsview/${category.id}`)} 
                  className="text-sm text-yellow-500"
                >
                  Add Product
                </button>
                <button 
                  style={{ backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius: '5px' }}
                  className="text-sm text-red-500"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {openCategory === category.id && (
              <div className="products ml-4 mt-2">
                {products.filter((product) => product.category === category.id)
                  .map((product, index) => (
                    <li key={index}>{product.name}</li>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesView;
