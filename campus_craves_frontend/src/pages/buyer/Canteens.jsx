import "./Canteens.css";
import Header from "../../components/Header";
import FoodGrid from "../../components/FoodGrid";

const Canteens = () => {
  return (
    <div>
      <Header/>
      <div className="food">
        <h2>Popular Canteens</h2>
        </div>
      <FoodGrid/>      
    </div>
  )
}

export default Canteens