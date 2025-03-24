import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>

      <div className="mb-4">
        <input
          type="text"
          className="border border-gray-400 px-2 py-1 mr-2"
          placeholder="New Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-3 py-1" onClick={handleAddCategory}>
          Add Category
        </button>
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>

      <ul>
  {categories.map((category) => (
    <li
      key={category.id}
      className="mb-1 flex justify-between border-b pb-1"
    >
      <span className="cursor-pointer text-blue-500 hover:underline"
      onClick={() => navigate("/admin/productsview", { state: { categoryId: category.id } })}>
        {category.name}
      </span>
      <button
        className="text-sm text-red-500"
        onClick={() => handleDeleteCategory(category.id)}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default CategoriesView;