import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <Navbar bg="danger" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{textDecoration:"bold"}}>
        <h2>CampusCrave</h2></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/menu">Browse Menu</Nav.Link>
            <Nav.Link as={Link} to="/offers">Special Offers</Nav.Link>
            <Nav.Link as={Link} to="/canteens">Canteens</Nav.Link>
            <Nav.Link as={Link} to="/order">Orders</Nav.Link>
            <Nav.Link as={Link} to="/categoriesview">Categories</Nav.Link>
            <Nav.Link as={Link} to="/ordersview">Orders View</Nav.Link>
            <Nav.Link as={Link} to="/login">Login/Signup</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;