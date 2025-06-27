import React from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>الصفحة الرئيسية</title>
      </Helmet>
      {/*Navbar*/}
      <Navbar />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
      {/* CTA Section */}
      <Cta />
      {/* Footer Section */}
      <Footer />
    </>
  );
};
export default LandingPage;
