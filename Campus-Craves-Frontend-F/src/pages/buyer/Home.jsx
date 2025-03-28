import "./Home.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HomeImage from "../../components/HomeImage";

const Home = () => {
  return (
    <div className="page-content">
      <Header />
      <HomeImage />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;