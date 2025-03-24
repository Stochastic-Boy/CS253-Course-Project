// // ProductsView.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// import { useParams } from "react-router-dom";

// const ProductsView = () => {

//   const { categoryId } = useParams();

//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//   });
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState("");

//   const accessToken = localStorage.getItem("access_token");
//   const user = useSelector((state) => state.user.user);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/products/products/", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         setProducts(res.data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/products/categories/", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         setCategories(res.data);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };

//     fetchProducts();
//     fetchCategories();
//   }, [accessToken]);

//   const handleAddProduct = async () => {
//     if (!newProduct.name || !newProduct.category || !newProduct.price) {
//       setError("Name, price, and category are required.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/products/products/",
//         newProduct,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setProducts([...products, res.data]);
//       setNewProduct({ name: "", description: "", price: "", category: "" });
//       setError("");
//     } catch (err) {
//       console.error("Error adding product:", err);
//       setError("Failed to add product.");
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/products/products/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         data: {},
//       });
//       setProducts(products.filter((product) => product.id !== id));
//     } catch (err) {
//       console.error("Error deleting product:", err);
//       setError("Failed to delete product.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-2">Manage Products</h2>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Product Name"
//           className="border px-2 py-1 mr-2"
//           value={newProduct.name}
//           onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           className="border px-2 py-1 mr-2"
//           value={newProduct.description}
//           onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           className="border px-2 py-1 mr-2"
//           value={newProduct.price}
//           onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//         />
//         <select
//           className="border px-2 py-1 mr-2"
//           value={newProduct.category}
//           onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         <button className="bg-green-500 text-white px-3 py-1" onClick={handleAddProduct}>
//           Add Product
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       <ul>
//         {products.map((product) => (
//           <li key={product.id} className="border-b pb-1 mb-2 flex justify-between">
//             <span>
//               {product.name} - {product.description} - ₹{product.price} - {product.category_name}
//             </span>
//             <button
//               className="text-sm text-red-500"
//               onClick={() => handleDeleteProduct(product.id)}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProductsView;

// ProductsView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProductsView = () => {
  const location = useLocation();
  const categoryId = location.state?.categoryId;

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: categoryId || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("access_token");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://127.0.0.1:8000/products/products/";
        if (categoryId) {
          url += `?category=${categoryId}`; // Fetch products for selected category
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProducts(res.data);
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
  }, [accessToken, categoryId]);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      setError("Name, price, and category are required.");
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
      setNewProduct({ name: "", description: "", price: "", category: "categoryId" });
      setError("");
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/products/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {},
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
          className="border px-2 py-1 mr-2"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <select
          className="border px-2 py-1 mr-2"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button className="bg-green-500 text-white px-3 py-1" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
  {products
    .filter((product) => !categoryId || product.category === categoryId) // Filter products by categoryId
    .map((product) => (
      <li key={product.id} className="border-b pb-1 mb-2 flex justify-between">
        <span>
          {product.name} - {product.description} - ₹{product.price} - {product.category_name}
        </span>
        <button
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