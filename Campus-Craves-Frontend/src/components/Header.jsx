import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate=useNavigate();
  const isLoggedIn = () => {
    return localStorage.getItem("user") && localStorage.getItem("access_token");
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // Ensures state is fully refreshed
  };

  return (
    <Navbar bg="danger" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{textDecoration:"bold"}}>
        <h2>CampusCrave</h2></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/canteens">Canteens</Nav.Link>
            <Nav.Link as={Link} to="/order">Orders</Nav.Link>
            {isLoggedIn() ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login/Signup</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;