// Hero.js
import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../assets/Hero1.jpg"; 

const Hero = () => {
  return (
    <section 
      id="Hero" 
      className="relative h-screen bg-cover bg-center flex items-center" 
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Overlay to make the text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      
      {/* Main content */}
      <div className="relative z-10 container px-6 mx-auto">
        <div className="max-w-3xl mx-auto text-center" dir="rtl"> {/* تم تعديل هذا السطر لجعل المحتوى في المنتصف */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            منصة واحدة لكل ما تحتاجه سيارتك
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            كراجات يجمع كل ما تحتاجه سيارتك في مكان واحد لجعل اقتناء قطع الغيار
            أسهل من أي وقت مضى
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              ابدأ الآن
            </Link>
            <Link
              to="/search"
              className="px-8 py-3 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition duration-300"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;