import "./Canteens.css";
import Header from "../../components/Header";
import FoodGrid from "../../components/FoodGrid";
import Footer from "../../components/Footer"
import HomeImage from "../../components/HomeImage";

const Canteens = () => {
  return (
    <div>
      <Header/>
      <div className="food">
        <h2>Popular Canteens</h2>
        </div>
      <FoodGrid/>
      {/* <Footer/> */}
      
    </div>
  )
}

export default Canteens