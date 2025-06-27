import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import MainLayout from "../../components/MainLayout/MainLayout";
import FeaturesSection from "../../components/Features/FeaturesSection";
import Testimonial from "../../components/Testmonial/Testimonial";
import PageDetails from "../../components/PageDetails/PageDetails";
import axios from "axios";
import { links } from "../../contstants";

function PrivacyPolicy() {
  const [privacyPolicyData, setPrivacyPolicyData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${links.BASE_URL}pages/get-page?pageName=Privacy-policy`
      );
      setPrivacyPolicyData(
        response?.data?.data?.description || "<p>No content available</p>"
      );
    } catch (error) {
      console.error("Error fetching privacy policy data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <Header color="black" />
      <PageDetails title="Privacy Policy" content={privacyPolicyData} />
      <FeaturesSection />
      <Testimonial />
    </MainLayout>
  );
}

export default PrivacyPolicy;
