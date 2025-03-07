import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home"
import Menu from "./pages/customer/Menu"
import Offers from "./pages/customer/Offers"
import Canteens from "./pages/customer/Canteens"
import Orders from "./pages/customer/Orders";
import BuyerLoginPage from "./pages/customer/BuyerLoginPage";
import BuyerSignUpPage from "./pages/customer/BuyerSignUpPage";
import SignUp from "./components/SignUp";
import LoginForm from "./components/LoginForm";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerSignUpPage from "./pages/seller/SellerSignUpPage";
import ProductsView from "./pages/seller/ProductsView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/buyer-login" element={<BuyerLoginPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/seller-login" element={<SellerLoginPage />} />
        <Route path="/seller-signup" element={<SellerSignUpPage />} />
        <Route path="/buyer-signup" element={<BuyerSignUpPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/productsview" element={<ProductsView />} />
      </Routes>
    </Router>
  );
};

export default App;
