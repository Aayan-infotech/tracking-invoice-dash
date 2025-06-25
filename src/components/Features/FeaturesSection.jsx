import React from "react";
import { Container } from "react-bootstrap";
import { images } from "../../contstants";

function FeaturesSection() {
  return (
    <>
      <section className="feature-section text-dark pt-5 text-center">
        <Container>
          <h1 className="fw-bold">
            Track every <span className="text-primary">project</span> cost down
            to the
            <br />
            last detail to keep everything on{" "}
            <span className="text-primary">point</span>
          </h1>
          <p className="mt-3">
            IPA is designed for businesses and freelancers who need a smart
            solution to monitor project costs and manage Q&A with ease. From
            budgeting each phase to keeping communication clear and organized,
            the app helps streamline your workflow while maintaining complete
            visibility and control.
          </p>
          {/* App Store Buttons */}
          <div className="my-4">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              width={150}
              className="me-2"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              width={170}
            />
          </div>
          {/* Feature Images */}
          <div className="row justify-content-center mt-5">
            <div className="col-md-4 img-4-section-4">
              <img src={images.Home3} className="img-fluid" alt="Home 3" />
            </div>
            <div className="col-md-4 img-5-section-5">
              <img src={images.Home1} className="img-fluid" alt="Home 1" />
            </div>
            <div className="col-md-4 img-4-section-4">
              <img src={images.Home2} className="img-fluid" alt="Home 2" />
            </div>
          </div>
        </Container>
      </section>
      <section className="features-section-2 mt-5 pt-5 pb-5 bg-light">
        <Container>
          <h1 className="fw-bold mb-5">
            Effortless and fully automated{" "}
            <span className="text-primary">invoicing</span>
            <br />
            reimagined for professionals.
          </h1>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="feature-card p-4 shadow-sm bg-white rounded-3 text-start">
                <div className="iconContainer mb-3">
                  <i className="bi bi-briefcase-fill"></i>
                </div>
                <h5 className="mt-2">Simplicity</h5>
                <p className="mt-2">
                  IPA is an invoicing app for businesses who prioritize ease of
                  use and the quality of service provided by our team.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card p-4  bg-light rounded-3 text-start">
                 <div className="iconContainer mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h5 className="mt-2">Teams</h5>
                <p>
                  IPA is built for businesses and professionals working collaboratively on different tasks, with dedicated team members assigned to each task.
                </p>
              </div>
            </div>
             <div className="col-md-6">
              <div className="feature-card p-4  bg-light rounded-3 text-start">
                 <div className="iconContainer mb-3">
                  <i className="bi bi-telegram"></i>
                </div>
                <h5 className="mt-2">Taskflow</h5>
                <p>
                  Tasks are distributed among the right team members to ensure clarity, focus, and smooth collaboration.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-card p-4 shadow-sm bg-white rounded-3 text-start">
                <div className="iconContainer mb-3">
                  <i className="bi bi-moon-fill"></i>
                </div>
                <h5 className="mt-2">Trust</h5>
                <p className="mt-2">
                  IPA for businesses and teams who prioritize user comfort and the quality of invoicing services provided by our team.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default FeaturesSection;
