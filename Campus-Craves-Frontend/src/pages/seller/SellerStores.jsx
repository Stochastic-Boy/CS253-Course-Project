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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellerStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([
    { id: 1, name: "Hall 6", description: "Awesome", location: "Health Centre, IIT Kanpur", status: "Open" },
    { id: 2, name: "Hall 12", description: "Great", location: "Outskirts", status: "Open" }
  ]);
  
  const [newStore, setNewStore] = useState({ name: "", description: "", location: "", status: "" });

  const handleAddStore = () => {
    if (newStore.name && newStore.description && newStore.location && newStore.status) {
      setStores([...stores, { id: Date.now(), ...newStore }]);
      setNewStore({ name: "", description: "", location: "", status: "" });
    }
  };

  const handleDeleteStore = (id) => {
    setStores(stores.filter(store => store.id !== id));
  };

  return (
    <div className="store-management p-4">
      <h2>Seller Store Management</h2>
      <div>
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
          onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newStore.location}
          onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newStore.status}
          onChange={(e) => setNewStore({ ...newStore, status: e.target.value })}
        />
        <button onClick={handleAddStore}>Add Store</button>
      </div>

      <ul>
        {stores.map(store => (
          <li key={store.id}>
            <span onClick={() => navigate(`/productsview`)}>
              {store.name} - {store.description} - {store.location} - {store.status}
            </span>
            <button>
              Update
            </button>
            <button onClick={() => handleDeleteStore(store.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerStores;
