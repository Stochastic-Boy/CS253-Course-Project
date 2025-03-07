import LoginForm from "../../components/LoginForm"; 
import { useState } from "react";

const SellerLoginPage = () => {
  const [storeId, setStoreId] = useState("");

  return (
    <div>
      <LoginForm 
        title="Seller's Login" 
        showStoreId={true} 
        storeId={storeId} 
        setStoreId={setStoreId} 
      />
    </div>
  );
};

export default SellerLoginPage;