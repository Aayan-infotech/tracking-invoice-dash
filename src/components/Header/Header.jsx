import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
function Header({ color }) {
  return (
    <>
      <Navbar background="transparent" expand="lg" className="header pt-4">
        <Container>
          <Link to="/" className="text-dtext-decoration-none">
            <Navbar.Brand className={`poppins-semibold text-${color}`}>
              Installer Project Assist
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-lg`}
            className={`bg-${color}`}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-xl`}
            aria-labelledby={`offcanvasNavbarLabel-expand-xl`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xl`}>
                Offcanvas
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
                <Link to="/terms-and-conditions" className={`text-${color} linkBtn`}>
                  Term & Conditions
                </Link>

                <Link to="/privacy-policy" className={`text-${color} linkBtn`}>
                  Privacy Policy
                </Link>
              </Nav>
              <Button className="btn-primary customeBtn">App Store</Button>
              <Button className="btn-secondary ms-2 customeBtn2">
                Play Store
              </Button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
