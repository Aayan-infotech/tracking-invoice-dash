import React from "react";
import { images } from "../../contstants";
import { Button, Container } from "react-bootstrap";
import Header from "../Header/Header";

function HeroSection() {
  return (
    <div className="hero-container">
      <Header />

      <section className="hero-section text-white d-flex align-items-center justify-content-center px-3">
        <Container>
          <h1 className="display-5 fw-bold">
            Easily create and
            <br />
            manage <span className="text-info">Projects</span> with us.
          </h1>
          <p className="lead">
            {/* The primary function of this app is to track project costs and
            streamline <br />
            QA &amp; efficiency. Helps organize and control throughout. Lorem
            ipsum <br />
            dolor sit amet consectetur adipisicing elit. Iste, doloremque. */}
            The primary function of the app is to track project costs and manage
            Q&A efficiently, helping you stay organized and in control
            throughout your workflow
          </p>
          <a href="#" className="btn btn-outline-light p-3">
            Get Started <i className="bi bi-arrow-right ms-2" />
          </a>
          <div className="row custom-row">
            <div className="col-md-4 img-1-section-1">
              <img src={images.Home2} className="img-fluid" alt="Home 2" />
            </div>
            <div className="col-md-4 img-2-section-2">
              <img src={images.Home3} className="img-fluid" alt="Home 3" />
            </div>
            <div className="col-md-4 img-3-section-3">
              <img src={images.Home1} className="img-fluid" alt="Home 1" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default HeroSection;
