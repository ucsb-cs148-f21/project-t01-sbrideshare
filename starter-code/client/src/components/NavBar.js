import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import ucsbAccount from "../utils/ucsb-account";
import "../styles/navbar.css";

export default function NavBar(props) {
  const user = props.user;
  const navBarActive = props.navBarActive;
  let findActive = false;
  let createActive = false;
  let myRidesActive = false;;
  let homeActive = false;

  if(navBarActive === "Find A Ride") {
    findActive = true;
  }else if(navBarActive === "Create A Ride") {
    createActive = true;
  }else if(navBarActive === "My Rides") {
    myRidesActive = true;
  }else if(navBarActive === "Home") {
    homeActive = true;
  }

  return (
    <Navbar variant="dark" expand="lg" id="navbar">
      <Container>
        <Navbar.Brand href="/">SB RideShare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link active={homeActive} href="/">Home</Nav.Link>
            {ucsbAccount(user) && <Nav.Link active={findActive} href="/rides">Find A Ride</Nav.Link>}
            {ucsbAccount(user) && <Nav.Link active={createActive} href="/ride">Create A Ride</Nav.Link>}
            {ucsbAccount(user) && <Nav.Link active={myRidesActive} href="/myrides">My Rides</Nav.Link>}
          </Nav>
          <Nav>
            {!user ? (
              <div />
            ) : (
              <NavDropdown
                title={
                  <span>
                    Hello, {user.fullName}{" "}
                    <img
                      src={user.imageUrl}
                      alt="profile"
                      style={{ width: "24px", height: "24px" }}
                    />{" "}
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item onClick={user.signOut}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
