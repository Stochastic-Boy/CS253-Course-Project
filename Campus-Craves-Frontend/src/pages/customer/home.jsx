import "./Home.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer"

const Home = () => {
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
      <Footer/>
      
    </div>
  );
};
export default Home;


