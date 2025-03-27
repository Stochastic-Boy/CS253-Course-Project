import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import AdminImage from '../../images/admin.png';
import UserImage from '../../images/user.png';
import './SellerProfile.css';

const SellerProfileWithStores = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { sellerId } = useParams();

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

  useEffect(() => {
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

    fetchSellerData();
    fetchStores();
  }, [sellerId]);

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
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  const handleUpdateStore = async () => {
    if (!storeId) return;
    try {
      await axios.put(`http://127.0.0.1:8000/stores/${storeId}/`, editedStore, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setStores(stores.map((store) => (store.id === storeId ? { ...store, ...editedStore } : store)));
      setEditingStore(null);
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
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#2b2b2b", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>Campus Craves</div>
      <div style={{ width: "350px", backgroundColor: "#333", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", textAlign: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#ff9800", height: "50px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}></div>
        <img src={AdminImage} alt="Owner" style={{ width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #fff", marginTop: "-40px" }} />
        <h2>{sellerData.business_name}</h2>
        <p><strong>Contact:</strong> {sellerData.contact_number}</p>
        <p><strong>Location:</strong> {sellerData.location}</p>
      </div>

      <div className="store-management p-4" style={{ marginTop: "20px" }}>
        <h2 className="text-center">Manage Stores</h2>
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
              <div key={store.id}>
                <div className="mt-2 mb-4">
                  <div className="storename">{store.name}</div>
                  <div>{store.description}</div>
                  <div>Location: {store.location}</div>
                  <div>Status: {store.status}</div>
                </div>
                {/* <span>{store.name} - {store.description} - {store.location} - {store.status}</span> */}
                <button className="mx-3" onClick={() => setEditingStore(store.id)}>Edit</button>
                <button onClick={handleDeleteStore}>Delete</button>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SellerProfileWithStores;