import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home"
import Menu from "./pages/customer/Menu"
import Offers from "./pages/customer/Offers"
import Canteens from "./pages/customer/Canteens"
import Cart from "./pages/customer/Cart"
import Login from "./pages/customer/Login"
import OrderHistory from "./pages/customer/OrderHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
