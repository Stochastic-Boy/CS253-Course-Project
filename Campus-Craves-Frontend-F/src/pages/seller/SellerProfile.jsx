import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SellerProfileWithStores = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [sellerData, setSellerData] = useState({
    business_name: "",
    contact_number: "",
    location: "",
    image: "/assets/profile.png",
  });

  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [editedStore, setEditedStore] = useState({ name: "", description: "", location: "", status: "open" });
  const [newStore, setNewStore] = useState({ name: "", description: "", location: "", status: "open" });

  const [isEditing, setIsEditing] = useState(false);

  const fetchSellerData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setSellerData(response.data);
    } catch (error) {
      console.error("Error fetching seller details:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/stores/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      
      const filteredStores = response.data.filter((store) => store.seller_id === Number(sellerId));
      setStores(filteredStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  
  useEffect(() => {
    fetchSellerData();
    fetchStores();
  }, [fetchTrigger]);

  useEffect(() => {
    if (stores.length > 0) {
      setStoreId(stores[0].id);
    } else {
      setStoreId(null);
    }
  }, [stores]);

  const handleCreateStore = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/stores/create/", newStore, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setStores([...stores, response.data]);
      setNewStore({ name: "", description: "", location: "", status: "open" });
      setFetchTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  const handleUpdateStore = async () => {
    if (!editingStore) return;
    try {
      await axios.put(`http://127.0.0.1:8000/stores/${editingStore}/`, editedStore, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      
      setStores(stores.map((store) =>
        store.id === editingStore ? { ...store, ...editedStore } : store
      ));
      
      setEditingStore(null); 
      setEditedStore({ name: "", description: "", location: "", status: "open" }); 
      setFetchTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };
  
  const handleDeleteStore = async () => {
    if (!storeId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/stores/${storeId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setStores(stores.filter((store) => store.id !== storeId));
      setFetchTrigger((prev) => prev + 1);
    } 
    catch (error) {
      console.error("Error deleting store:", error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "contact_number") {
      setSellerData((prevData) => ({
        ...prevData,
        contact_number: value,
      }));
    }
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      axios.put("http://127.0.0.1:8000/users/profile/", sellerData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => console.log("Updated successfully:", response.data))
        .catch((error) => console.error("Error updating profile:", error));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#2b2b2b", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>Campus Craves</div>
      <div style={{ width: "350px", backgroundColor: "#333", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", textAlign: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#ff9800", height: "50px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}></div>
        <img src="/assets/profile.png" alt="Profile Icon" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #fff", marginTop: "-40px" }} />
         <h2>{isEditing ? (
          <input 
                type="text" 
                name="business_name"  
                value={sellerData.business_name}
                readOnly
                style={{ width: "100%", padding: "5px", fontSize: "16px", textAlign: "center", backgroundColor: "#616161", color: "white", border: "none", borderRadius: "5px" }} />
        ) : sellerData.business_name}</h2>
        <p><strong>Contact:</strong> {isEditing ? (
          <input 
          type="text" 
          name="contact_number" 
          value={sellerData.contact_number || ""} 
          onChange={handleChange} 
          style={{ width: "100%", padding: "5px", fontSize: "16px", textAlign: "center", backgroundColor: "#616161", color: "white", border: "none", borderRadius: "5px" }} />
        ) : sellerData.contact_number}</p>
        <p><strong>Location:</strong> {isEditing ? (
          <input 
                type="text" 
                name="location" 
                value={sellerData.location} 
                readOnly
                style={{ width: "100%", padding: "5px", fontSize: "16px", textAlign: "center", backgroundColor: "#616161", color: "white", border: "none", borderRadius: "5px" }} />
        ) : sellerData.location}</p> 
        
        <button onClick={toggleEdit} style={{ marginTop: "10px", padding: "8px 16px", fontSize: "16px", cursor: "pointer", border: "none", borderRadius: "5px", backgroundColor: isEditing ? "#4caf50" : "#ff9800", color: "white" }}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="store-management p-4" style={{ marginTop: "20px" }}>
        <h2>Manage Stores</h2>
        {stores.length === 0 ? (
          <div>
            <h3>No stores found. Create a new store:</h3>
            <input type="text" placeholder="Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
            <input type="text" placeholder="Description" value={newStore.description} onChange={(e) => setNewStore({ ...newStore, description: e.target.value })} />
            <input type="text" placeholder="Location" value={newStore.location} onChange={(e) => setNewStore({ ...newStore, location: e.target.value })} />
            <button onClick={handleCreateStore}>Create Store</button>
          </div>
        ) : (
          <ul>
            {stores.map((store) => (
      <li key={store.id}>
        {editingStore === store.id ? (
          <div>
            <input
              type="text"
              value={editedStore.name}
              onChange={(e) => setEditedStore({ ...editedStore, name: e.target.value })}
            />
            <input
              type="text"
              value={editedStore.description}
              onChange={(e) => setEditedStore({ ...editedStore, description: e.target.value })}
            />
            <input
              type="text"
              value={editedStore.location}
              onChange={(e) => setEditedStore({ ...editedStore, location: e.target.value })}
            />
            <button onClick={handleUpdateStore}>Save</button>
            <button onClick={() => setEditingStore(null)}>Cancel</button>
          </div>
        ) : (
          <div>
          <span>{store.name} - {store.description} - {store.location} - {store.status}</span>
          <button onClick={() => {
            setEditingStore(store.id);
            setEditedStore(store); 
          }}>Edit</button>
          <button onClick={handleDeleteStore}>Delete</button>
        </div>
        )}
      </li>
    ))}
    </ul>
        )}
      </div>
    </div>
  );
};

export default SellerProfileWithStores;
