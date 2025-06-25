import React from "react";
import MainLayout from "../../components/MainLayout/MainLayout";
import HeroSection from "../../components/Hero/HeroSection";
import FeaturesSection from "../../components/Features/FeaturesSection";
import Testimonial from "../../components/Testmonial/Testimonial";

function Homepage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <Testimonial />
    </MainLayout>
  );
}

export default Homepage;
