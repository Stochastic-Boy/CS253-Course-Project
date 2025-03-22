import { useState } from "react";
import "./ProductsView.css"; // Import CSS file for styling
import { Link } from "react-router-dom";

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", category: "", price: "" });

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.category || !newProduct.price) return;
    setProducts([
      ...products,
      { id: products.length + 1, ...newProduct, price: Number(newProduct.price), inStock: true },
    ]);
    setNewProduct({ title: "", category: "", price: "" });
  };
  
  const toggleStock = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, inStock: !product.inStock } : product
      )
    );
  };

  return (

  <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Product List */}
        <div className="product-list">
          <h2>Products</h2>
          <div className="product-items">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <span className="product-id">{product.id}</span>
                <span className="product-title">{product.title}</span>
                <span className="product-category">{product.category}</span>
                <span className="product-price">Rs. {product.price}</span>
                <span className="stock-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={product.inStock}
                      onChange={() => toggleStock(product.id)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="stock-text">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                </span>

              </div>
            ))}
          </div>
        </div>
    

     {/* New Product Form */}
    <div className="new-product-form">
      <h2>New Product</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newProduct.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={newProduct.category}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleChange}
      />
      <button onClick={addProduct}>Create</button>
    </div>
  </div>
</div>
  );
}