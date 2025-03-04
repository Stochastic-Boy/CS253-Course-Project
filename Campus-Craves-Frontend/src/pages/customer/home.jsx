import "./Home.css";
import Header from "../../components/Header";
import FoodGrid from "../../components/FoodGrid.jsx";
import Footer from "../../components/Footer"

const Home = () => {
  return (
    <div>
      <Header/>
      <div className="hero">
        <p>
          <h1 className="para" style={{color:"white", margin:"15vh auto auto 5vw"}}>Tasty food at your 
            <h1 className="fing" style={{color:"orange"}}>fingertips</h1></h1>
        </p>
        <img src="src\assets\egg.png" alt="Food Poster" className="hero-image" />
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
  );
};
export default Home;


// const Home = () => {
//   return (
//     <div>
//       <p>home is coming </p>
//     </div>
//   )
// }

// export default Home
