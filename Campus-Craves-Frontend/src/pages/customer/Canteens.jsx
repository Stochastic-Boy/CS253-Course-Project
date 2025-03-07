import "./Canteens.css";
import Header from "../../components/Header";
import FoodGrid from "../../components/FoodGrid.jsx";
import Footer from "../../components/Footer"
const Canteens = () => {
  return (
    <div>
      <Header/>
      <div className="hero">
      <h1 className="para">
           Tasty food at your <span className="fing">Fingertips</span>
      </h1>

        <img src="\assets\egg.png" alt="Food Poster" className="hero-image" />
        <div className="hero-overlay">
          <input type="text" placeholder="Search for food..." className="search-box" />
        </div>
      </div>
      <div className="food">
        <h2>Popular Canteens</h2>
        </div>
      <FoodGrid/>
      <Footer/>
      
    </div>
  )
}

export default Canteens