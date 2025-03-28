import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { useDispatch, useSelector } from "react-redux"; 
import './Header.css'
import { logout } from "../reduxfeatures/userSlice";


const Header = () => {

  const userData = useSelector((state)=>state.user.user);
  const dispatch = useDispatch();

  return (

    <Navbar variant="dark" expand="lg" className="navbar py-2">
    <Container className="navContainer">
      <Navbar.Brand className="navlogo" as={Link} to="/" style={{textDecoration:"bold"}}>
        <h2 className="textlogo">Campus Craves</h2>
      </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            <Nav.Link className="navbutton home-btn" as={Link} to="/">Home</Nav.Link> 

            <Nav.Link className="navbutton" as={Link} to="/canteens">Canteens</Nav.Link>
             <Nav.Link className="navbutton" as={Link} to="/order">Orders</Nav.Link>
             <div className="auth">
               {userData ? 
               <>
                <Nav.Link as={Link} to="/profile" className="navbutton userAvatar px-4">
                  {userData?.username}
                </Nav.Link>
                <button onClick={()=>dispatch(logout())} className="user-logout-btn">Logout</button>
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