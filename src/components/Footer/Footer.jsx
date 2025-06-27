import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

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
              <Link to="#">
                <i className="bi bi-facebook text-white" width={24}></i>
              </Link>
              <Link to="#">
                <i className="bi bi-twitter-x text-white" width={24}></i>
              </Link>
              <Link to="#">
                <i className="bi bi-linkedin text-white" width={24}></i>
              </Link>
            </div>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <ul className="list-unstyled mt-3">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="footer-link">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-5">
            <h6>Subscribe to new Newsletter</h6>
            <p className="small">
              What are you waiting for?! Subscribe and follow our progress!
            </p>
            <form className="d-md-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="email@company.com"
              />
              <button className="btn btn-primary mt-md-0 mt-2" style={{ minWidth: "150px" }}>
                Subscribe now
              </button>
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
