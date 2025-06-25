import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Header() {
  return (
    <>
      <Navbar background="transparent" expand="lg" className="header pt-4">
        <Container>
          <Navbar.Brand href="#home" className="poppins-semibold text-white">Installer Project Assist</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#features" className="text-white">Term & Conditions</Nav.Link>
            <Nav.Link href="#pricing" className="text-white">Privacy Policy</Nav.Link>
          </Nav>

          <Button className="btn-primary customeBtn">App Store</Button>
          <Button className="btn-secondary ms-2 customeBtn2">Play Store</Button>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
