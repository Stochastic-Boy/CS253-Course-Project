import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductsView = () => {
  const { categoryId } = useParams();
  const categoryIdNum = Number(categoryId); 

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: categoryIdNum || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/products/products/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const filteredProducts = res.data.filter(
          (product) => product.category === categoryIdNum
        );
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/products/categories/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [accessToken, categoryIdNum]); 

  const validateProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      setError("Name, price, and category are required.");
      return false;
    }
    
    // Validate price is not negative
    if (parseFloat(newProduct.price) < 0) {
      setError("Price cannot be negative.");
      return false;
    }
    
    // Check for duplicates
    const isDuplicate = products.some(product => 
      product.name === newProduct.name && 
      product.description === newProduct.description && 
      product.category === newProduct.category
    );
    
    if (isDuplicate) {
      setError("A product with the same name and description already exists in this category.");
      return false;
    }
    
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateProduct()) {
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/products/products/",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts([...products, res.data]);
      setNewProduct({ name: "", description: "", price: "", category: categoryIdNum || "" });
      setError("");
    } catch (err) {
      console.error("Error adding product:", err);
      if (err.response && err.response.data) {
        // Handle specific server validation errors
        if (err.response.data.price) {
          setError(`Price error: ${err.response.data.price[0]}`);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]);
        } else {
          setError("Failed to add product. Please check your inputs.");
        }
      } else {
        setError("Failed to add product. Please try again.");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/products/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Manage Products</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          className="border px-2 py-1 mr-2"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="border px-2 py-1 mr-2"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          className="border px-2 py-1 mr-2"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <select
          className="border px-2 py-1 mr-2"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: Number(e.target.value) })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button style={{backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius:'5px'}} className="bg-green-500 text-white px-3 py-1" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b pb-1 mb-2 mx-2 flex justify-between">
            <span>
              {product.name} - {product.description} - ₹{product.price} -{" "}
              {categories.find((cat) => cat.id === product.category)?.name || "Unknown"}
            </span>
            <button style={{backgroundColor: 'rgb(255, 158, 2)', border: 'none', borderRadius:'5px', marginLeft: '20px'}}
              className="text-sm text-red-500"
              onClick={() => handleDeleteProduct(product.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsView;