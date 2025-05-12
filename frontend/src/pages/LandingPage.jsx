import React from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Cta from "../components/Cta";
const LandingPage = () => {
  return (
    <>
      {/*Navbar*/}
      <Navbar />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* CTA Section */}
      <Cta />
    </>
  );
};
export default LandingPage;
