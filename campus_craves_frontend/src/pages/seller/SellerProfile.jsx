import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SellerProfileWithStores = () => {
  const user = useSelector((state) => state.user.user);
  const { sellerId } = useParams();

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [sellerData, setSellerData] = useState({
    business_name: "",
    contact_number: "",
    location: "",
    image: "/assets/profile.png",
  });

  const [phoneError, setPhoneError] = useState("");
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

  // Validate Indian phone number (10 digits)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

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
      // Only allow digits to be entered
      const digitsOnly = value.replace(/\D/g, '');
      
      // Check length for phone validation
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
      
      setSellerData((prevData) => ({
        ...prevData,
        contact_number: digitsOnly,
      }));
    }
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Validate phone number before saving
      if (sellerData.contact_number && !validatePhoneNumber(sellerData.contact_number)) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      }
      
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

  const errorStyle = {
    color: "#ff6b6b",
    fontSize: "12px",
    margin: "5px 0"
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#2b2b2b", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ width: "350px", backgroundColor: "#333", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", textAlign: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#ff9800", height: "50px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}></div>
        <img src="/assets/admin.png" alt="Profile Icon" style={{backgroundColor:"black", width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #fff", marginTop: "-40px" }} />

        <div className="store-name my-1"><strong>{sellerData.business_name}</strong></div>
        <div className="store-name my-1"><strong>{user.email}</strong></div>
        
        <p className="mt-4"><strong>Contact:</strong> {isEditing ? (
          <>
            <input 
              type="text" 
              name="contact_number" 
              value={sellerData.contact_number || ""} 
              onChange={handleChange}
              maxLength={10} 
              style={{ width: "100%", padding: "5px", fontSize: "16px", textAlign: "center", backgroundColor: "#616161", color: "white", border: "none", borderRadius: "5px" }} />
            {phoneError && <div style={errorStyle}>{phoneError}</div>}
          </>
        ) : sellerData.contact_number}</p>
        
        <button onClick={toggleEdit} style={{ marginTop: "10px", padding: "8px 16px", fontSize: "16px", cursor: "pointer", border: "none", borderRadius: "5px", backgroundColor: isEditing ? "#4caf50" : "#ff9800", color: "white" }} disabled={isEditing && phoneError}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="store-management p-4" style={{ marginTop: "20px" }}>
        <h2>Manage Stores</h2>
        {stores.length === 0 ? (
          <div style={{display:"flex", flexDirection:"column", gap: "10px"}}>
            <h3>No stores found. Create a new store:</h3>
            <input type="text" placeholder="Store Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
            <input type="text" placeholder="Description" value={newStore.description} onChange={(e) => setNewStore({ ...newStore, description: e.target.value })} />
            <input type="text" placeholder="Location" value={newStore.location} onChange={(e) => setNewStore({ ...newStore, location: e.target.value })} />
            <button style={{ marginTop: "10px", padding: "4px 8px", fontSize: "16px", cursor: "pointer", border: "none", borderRadius: "5px", backgroundColor:"#ff9800", width:"200px"}} onClick={handleCreateStore}>Create Store</button>
          </div>
        ) : (
          <div>
            {stores.map((store) => (
            <div key={store.id}>
              {editingStore === store.id ? (
                <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"400px"}}>
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
                  <div className="store-edit-buttons" style={{display:"flex", gap:"10px"}}>
                    <button style={{ marginTop: "10px", padding: "4px 8px", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor:"rgb(0, 164, 44)", borderRadius: "5px", color: "white", margin:"10px 8px" }} onClick={handleUpdateStore}>Save</button>
                    <button style={{ marginTop: "10px", padding: "4px 8px", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor:"rgb(255, 0, 0)", borderRadius: "5px", color: "white", margin:"10px 8px" }} onClick={() => setEditingStore(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                <div><strong>{store.name}</strong></div>
                <div>{store.description}</div>
                <div><strong>Location: </strong>{store.location}</div>
                <div><strong>Status: </strong>{store.status}</div>

                <button style={{ marginTop: "10px", padding: "4px 8px", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor:"#ff9800", borderRadius: "5px", color: "white", margin:"10px 8px" }}
                onClick={() => {
                  setEditingStore(store.id);
                  setEditedStore(store); 
                }}>Edit Store</button>
                <button style={{ marginTop: "10px", padding: "4px 8px", fontSize: "16px", cursor: "pointer", border: "none", backgroundColor:"rgb(255, 0, 0)", borderRadius: "5px", color: "white", margin:"0 8px" }}
                onClick={handleDeleteStore}>
                Delete
                </button>
              </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfileWithStores;