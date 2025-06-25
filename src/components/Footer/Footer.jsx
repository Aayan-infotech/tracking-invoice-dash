import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer-section py-5 text-white">
      <Container>
        <div className="row">
          <div className="col-md-3 mb-4 mb-md-0">
            <h5>
              Installer
              <br />
              <strong>Project Assist</strong>
              <br />
              (IPA)
            </h5>
            <div className="d-flex gap-3 mt-3">
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook"
                  width={24}
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                  alt="Twitter"
                  width={24}
                />
              </a>
              <a href="#">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733561.png"
                  alt="LinkedIn"
                  width={24}
                />
              </a>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <h6>About us</h6>
            <ul className="list-unstyled mt-3">
              <li>
                <a href="#" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-5">
            <h6>Subscribe to new Newsletter</h6>
            <p className="small">
              What are you waiting for?! Subscribe and follow our progress!
            </p>
            <form className="d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="email@company.com"
              />
              <button className="btn btn-primary">Subscribe now</button>
            </form>
          </div>
        </div>
        <div className="text-center mt-4 small">
          © Copyright 2025 <span className="text-primary">Project App</span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
