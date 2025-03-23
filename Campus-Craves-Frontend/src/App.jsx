import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home"
import Menu from "./pages/customer/Menu"
import Offers from "./pages/customer/Offers"
import Canteens from "./pages/customer/Canteens"
import Orders from "./pages/customer/Orders";
import SignUp from "./components/SignUp";
import LoginForm from "./components/LoginForm";
import ProductsView from "./pages/seller/sellerview/ProductsView";
import OrdersView from "./pages/seller/OrdersView";
import CategoriesView from "./pages/seller/sellerview/CategoriesView";
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
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/*" element={<SellerView/>} />
        <Route path="/sellerstores" element={<SellerStores />} />
        <Route path="/productsview" element={<ProductsView />} />
        <Route path="/categoriesview" element={<CategoriesView />} />
        <Route path="/ordersview" element={<OrdersView />} />
      </Routes>
    </Router>
  );
};

export default App;
