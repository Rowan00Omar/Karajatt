import React from "react";
import Hero from "../components/Hero";
import Logo from "../assets/Logo.svg";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
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
