import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import './Header.css'
import { logout } from "../reduxfeatures/userSlice";


const Header = () => {
  const userData = useSelector((state)=>state.user.user);
  const dispatch = useDispatch();
  // console.log(userData);

  return (
    <Navbar variant="dark" expand="lg" className="navbar py-2">
      <Container className="navContainer">
        <Navbar.Brand className="navlogo" as={Link} to="/" style={{textDecoration:"bold"}}>
          <h2 className="textlogo">CampusCrave</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className="navbutton" as={Link} to="/">Home</Nav.Link>
            {/* <Nav.Link as={Link} to="/menu">Browse Menu</Nav.Link> */}
            {/* <Nav.Link as={Link} to="/offers">Special Offers</Nav.Link> */}
            <Nav.Link className="navbutton" as={Link} to="/canteens">Canteens</Nav.Link>
            <Nav.Link className="navbutton" as={Link} to="/order">Orders</Nav.Link>
            <div className="auth">
              {userData ? 
              <>
               <div className="userAvatar px-4">{userData?.username}</div>
               <button onClick={()=>dispatch(logout())} className="logout">Logout</button>
              </>
              :<Nav.Link className="loginBtn" as={Link} to="/login">Login</Nav.Link>
              }
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;