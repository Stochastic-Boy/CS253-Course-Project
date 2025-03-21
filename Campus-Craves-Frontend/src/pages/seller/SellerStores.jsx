/*
  This page is the page the seller lands up on after logging in or signing up as a seller.


  The following functionalities should be implemented --
  
  This page is for the seller to manage their stores.
  The seller can add, update, and delete stores. 
  For adding a store, the fields required are name, description, location, and status.
  For updating a store, the seller can click on the update button and the fields required are name, description, location, and status.
  For deleting a store, the seller can click on the delete button.
  The seller can also navigate to the products view page by clicking on the store name.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SellerStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  
  const [newStore, setNewStore] = useState({ name: "", description: "", location: "", status: "" });
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/stores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStores(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchStores();
  }, []);

  const handleAddStore = async () => {
    const { name, description, location, status } = newStore;
    if (name && description && location && status) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/stores/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStore),
        });
  
        if (response.ok) {
          const created = await response.json();
          setStores([...stores, created]);
          setNewStore({ name: "", description: "", location: "", status: "" });
          setError("");
        } else {
          const data = await response.json();
          console.error("Create Store Error:", JSON.stringify(data, null, 2)); // 👈 Clear JSON log
          setError(data.detail || "Failed to add store");
        }
      } catch (err) {
        setError("Something went wrong.");
        console.error("Network or server error:", err);
      }
    } else {
      setError("Please fill all fields.");
    }
  };
  const handleDeleteStore = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/stores/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setStores(stores.filter((store) => store.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };


  return (
    <div className="store-management p-4">
      <h2>Seller Store Management</h2>

      <input
        type="text"
        placeholder="Store Name"
        value={newStore.name}
        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newStore.description}
        onChange={(e) =>
          setNewStore({ ...newStore, description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Location"
        value={newStore.location}
        onChange={(e) =>
          setNewStore({ ...newStore, location: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Status"
        value={newStore.status}
        onChange={(e) =>
          setNewStore({ ...newStore, status: e.target.value })
        }
      />
      <button onClick={handleAddStore}>Add Store</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {stores.map((store) => (
          <li key={store.id}>
            <span onClick={() => navigate("/productsview")}>
              {store.name} - {store.description} - {store.location} - {store.status}
            </span>
            <button onClick={() => handleDeleteStore(store.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/")} className="nav-button home-button">
        Go to Home Page
      </button>
    </div>
  );
};

export default SellerStores;