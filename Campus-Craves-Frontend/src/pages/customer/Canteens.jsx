import "./Canteens.css";
import Header from "../../components/Header";
import FoodGrid from "../../components/FoodGrid.jsx";
import Footer from "../../components/Footer"
import Homeimg from "../../components/Homeimg";
import { useEffect } from "react";

const Canteens = () => {

  return (
    <div>
      <Header/>
      <Homeimg/>  
      <div className="food">
        <h2>Popular Canteens</h2>
      </div>
      <FoodGrid/>
      <Footer/>
      
    </div>
  )
}

export default Canteens