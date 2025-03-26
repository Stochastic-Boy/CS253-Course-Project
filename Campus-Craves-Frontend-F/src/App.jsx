import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/buyer/Home"
import Menu from "./pages/buyer/Menu"
import Canteens from "./pages/buyer/Canteens"
import Orders from "./pages/buyer/Orders";
import BuyerProfile from "./pages/buyer/BuyerProfile"
import CartPage from "./pages/buyer/CartPage";
import CheckoutPage from "./pages/buyer/CheckoutPage";
import SellerView from "./pages/seller/SellerView";
import SignUp from "./login-signup/SignUp";
import Login from "./login-signup/Login";
import ForgotPassword from "./login-signup/ForgotPassword";
import ResetPassword from "./login-signup/ResetPassword";
import ConfirmSignup from "./login-signup/ConfirmSignup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:storeId" element={<Menu />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/profile" element={<BuyerProfile />} />
        <Route path="/cart/:storeId" element={<CartPage />} />
        <Route path="/checkout/:storeId" element={<CheckoutPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-signup" element={<ConfirmSignup />} />
        <Route path="/seller/:sellerId/*" element={<SellerView />} />
      </Routes>
    </Router>
  );
};

export default App;
