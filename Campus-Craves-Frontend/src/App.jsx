import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home"
import Menu from "./pages/customer/Menu"
import Offers from "./pages/customer/Offers"
import Canteens from "./pages/customer/Canteens"
import Orders from "./pages/customer/Orders";
import SignUp from "./components/SignUp";
import Login from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ConfirmSignup from "./components/ConfirmSignup";
import ProductsView from "./pages/seller/sellerview/ProductsView";
import OrdersView from "./pages/seller/OrdersView";
import CategoriesView from "./pages/seller/CategoriesView";
import SellerStores from "./pages/seller/SellerStores";
import SellerView from "./pages/seller/sellerview/SellerView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-signup" element={<ConfirmSignup />} />
        <Route path="/admin/*" element={<SellerView/>} />
        <Route path="/sellerstores" element={<SellerStores />} />
      </Routes>
    </Router>
  );
};

export default App;
