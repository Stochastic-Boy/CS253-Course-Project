// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const SellerStores = () => {
//   const navigate = useNavigate();
//   const [stores, setStores] = useState([]);
//   const [newStore, setNewStore] = useState({
//     name: "",
//     description: "",
//     location: "",
//     status: "",
//   });

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchStores();
//   }, []);

//   const fetchStores = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/stores/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = res.data;
//       if (Array.isArray(data)) {
//         setStores(data);
//       } else {
//         console.error("Expected array but got:", data);
//         setStores([]); // fallback
//       }
//     } catch (err) {
//       console.error("Error fetching stores", err);
//       setStores([]); // avoid crash
//     }
//   };

//   const handleAddStore = async () => {
//     const { name, description, location, status } = newStore;
//     if (name && description && location && status) {
//       try {
//         await axios.post(
//           "http://127.0.0.1:8000/stores/create/",
//           { name, description, location, status },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setNewStore({ name: "", description: "", location: "", status: "" });
//         fetchStores();
//       } catch (err) {
//         console.error("Error creating store", err);
//       }
//     }
//   };

//   const handleDeleteStore = async (id) => {
//     try {
//       await axios.delete("http://127.0.0.1:8000/stores/${id}/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchStores();
//     } catch (err) {
//       console.error("Error deleting store", err);
//     }
//   };

//   return (
//     <div className="store-management p-4">
//       <h2>Seller Store Management</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Store Name"
//           value={newStore.name}
//           onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Description"
//           value={newStore.description}
//           onChange={(e) =>
//             setNewStore({ ...newStore, description: e.target.value })
//           }
//         />
//         <input
//           type="text"
//           placeholder="Location"
//           value={newStore.location}
//           onChange={(e) =>
//             setNewStore({ ...newStore, location: e.target.value })
//           }
//         />
//         <input
//           type="text"
//           placeholder="Status"
//           value={newStore.status}
//           onChange={(e) =>
//             setNewStore({ ...newStore, status: e.target.value })
//           }
//         />
//         <button onClick={handleAddStore}>Add Store</button>
//       </div>

//       <ul>
//         {stores.map((store) => (
//           <li key={store.id}>
//             <span onClick={() => navigate("/admin/productsview")}>
//               {store.name} - {store.description} - {store.location} -{" "}
//               {store.status}
//             </span>
//             <button>Update</button>
//             <button onClick={() => handleDeleteStore(store.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SellerStores;

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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SellerStores = () => {
  const user = useSelector((state)=>state.user.user);
  // console.log(user);
  const navigate = useNavigate();
  const [stores, setStores] = useState([
    // { id: 1, name: "Hall 6", description: "Awesome", location: "Health Centre, IIT Kanpur", status: "Open" },
    // { id: 2, name: "Hall 12", description: "Great", location: "Outskirts", status: "Open" }
  ]);
  
  const [newStore, setNewStore] = useState({ name: "", description: "", location: "", status: "open" });

  const handleAddStore = async () => {
    if (!newStore.name || !newStore.location || !newStore.status) {
      setError("Name, location, and status are required.");
      return;
    }
    // console.log(localStorage.getItem('access_token'))


    try {
      // Send a POST request to the backend
      const response = await axios.post(
        'http://127.0.0.1:8000/stores/create/',
        newStore,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the access token
          },
        }
      );
      console.log(response.data);

      // If the store is created successfully, update the state
      if (response.data) {
        setStores([...stores, response.data]); // Add the new store to the list
        setNewStore({ name: "", description: "", location: "", status: "open" }); // Reset the form
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error creating store:', error);
      setError(error.response?.data?.error || "Failed to create store. Please try again.");
    }
  };

  const handleDeleteStore = (id) => {
    setStores(stores.filter(store => store.id !== id));
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/stores/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setStores(response.data); // Update the state with fetched stores
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []); 

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
        
        <button onClick={handleAddStore}>Add Store</button>
      </div>

      <ul>
        {stores.map(store => (
          <li key={store.id}>
            <span onClick={() => navigate(`/admin/productsview`)}>
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