import React from "react";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import Logo from "../assets/LogoNoBack.png";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>الصفحة الرئيسية</title>
      </Helmet>
      <div className="block sm:hidden w-full flex justify-center pt-4 pb-0 bg-white">
        <img src={Logo} alt="Karajatt Logo" className="h-32" />
      </div>
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
