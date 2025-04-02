import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "./Menu.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Menu = () => {

  const { storeId } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  
  const [store, setStore] = useState({});
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategories, setNewCategories] = useState([]);
  const [newSelectedCategory, setNewSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [newCart, setNewCart] = useState([]);
  const [sellerData, setSellerData] = useState({});
  const [userDetails, setUserDetails] = useState({})
  const [checkoutMessage, setCheckoutMessage] = useState("")


  const fetchProducts = async (categoryId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/products/public/products/${storeId}/${categoryId}/`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (newSelectedCategory) {
      const selectedCategory = newCategories.find(cat => cat.name === newSelectedCategory);
      if (selectedCategory) {
        fetchProducts(selectedCategory.id);
      }
    }
  }, [newSelectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/products/public/categories/${storeId}/`);
      setNewCategories(res.data);
      setNewSelectedCategory(res.data.length > 0 ? res.data[0].name : "");
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
    }
  };

  const fetchSellerData = async (sellerId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/${sellerId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setSellerData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching seller details:", error);
    }
  };

  const addToCart = async (productId, quantityChange = 1) => {
    if (!accessToken) {
      alert("Please log in first!");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:8000/cart/add/",
        { product_id: productId, quantity: quantityChange }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
    } catch (err) {
      console.error("Error updating cart:", err.response?.data || err.message);
    }
    fetchCart();
  };
  

  const fetchCart=async()=> {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/cart/${storeId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setNewCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }
  const fetchStore = async () => {
    const res = await axios.get(`http://localhost:8000/stores/${storeId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    setStore(res.data);

    if(res.data.seller_id) {
      fetchSellerData(res.data.seller_id);
    }
  }

  useEffect(() => {
    if (accessToken && storeId) {
      fetchStore();
      fetchCategories();
      fetchCart();
    }  
  }, [accessToken, storeId]); 


  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/profile/", {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
        setUserDetails({ id: data.id, phone_number: data.phone_number, address: data.address });
    })
    .catch((error) => {
        console.error("Error fetching user data:", error);
    });
  }, [])


  const handleCheckout=()=> {
    //No delivery address provided. Please enter an address in your profile or during checkout.
    if(userDetails?.address == "") {
      setCheckoutMessage('Delivery Location is missing!! Enter you location in your profile')
    }
    else{
      navigate(`/checkout/${storeId}`);
    }
  }
  
  

  return (
    <div className="menupage">
      <Header />
      <div className="menu-container">
        <aside className="menu-sidebar">
          <div style={{backgroundColor:"rgb(72, 72, 72)", color:"white", padding:"8px 10px", marginBottom:"20px", borderRadius:"5px"}}>
            <h4 style={{ margin:"8px 0"}}>{store.name}</h4>
            <h6>Phone: <span style={{color: "rgb(44, 255, 251)", margin:"0 0", padding:"0 0"}}>{sellerData?.profile?.contact_number}</span></h6>
            <h6>Location: <span style={{color: "rgb(44, 255, 251)", margin:"0 0", padding:"0 0"}}>{sellerData?.profile?.location}</span></h6>
          </div>
          <h5 style={{padding:"0 15px", fontWeight:"bold"}}>Menu</h5>

          <ul>
            {newCategories.map((category) => (
              <li
              style={{fontSize: "18px"}}
                key={category.id}
                onClick={() => {
                  setNewSelectedCategory(category.name);
                  fetchProducts(category.id);
                }}
                className={category.name === newSelectedCategory ? "active" : ""}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </aside>

        <main className="menu-main">
          <h2>{newSelectedCategory}</h2>
          <input
            type="text"
            placeholder="Search for items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="menu-items">
            {products
              .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
              .map((item, index) => (
                <div key={index} className="menu-item" style={{display:"grid", gridTemplateColumns:"5fr 2fr 1fr"}}>
                  <div>{item.name}</div>
                  <div>₹{item.price}</div>
                  <button onClick={() => addToCart(item.id, 1)}>Add</button>
                </div>
              ))}
          </div>
        </main>

        <aside className="cart">
          <h4 className="mt-2 mb-4">Items in Cart</h4>
          
          {newCart?.items?.length > 0 ? (
            <div className="">
              <div className="cart-items-heading">
                <div>Product Name</div>
                <div>Quantity</div>
                <div>Price</div>
              </div>
              {newCart.items.map((item) => (
                <div key={item.id} className="cart-items">
                  <div>{item.product_name}</div>
                  <div className="quantity">
                    <div onClick={() => addToCart(item.product, 1)} className="plus">+</div>
                    <div className="mx-2">{item.quantity}</div>
                    <div onClick={() => addToCart(item.product, -1)} className="minus">-</div>
                  </div>
                  <div>₹{item.product_price * item.quantity}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in cart</p>
          )}

          <h3 className="mt-4">Total: ₹{newCart?.total_price || 0}</h3>
          {checkoutMessage && <p style={{color:"rgb(255, 0, 0)"}}>{checkoutMessage}</p>}
          <button onClick={handleCheckout} className="checkout">Checkout →</button>
        </aside>


      </div>
    </div>
  );
};

export default Menu;
