// Cta.js
import React from "react";
import { Link } from "react-router-dom";

const Cta = () => {
  return (
    <section id="cta" className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5LTEuNzktNC00LTRzLTQgMS43OTEtNCA0IDEuNzkgNCA0IDQgNC0xLjc5MSA0LTQgNC0xLjc5MS00LTR6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Flex Container */}
      <div className="relative z-10 container flex flex-col items-center justify-center px-6 mx-auto space-y-8 text-center">
        {/* Heading */}
        <h2 className="max-w-3xl text-4xl md:text-5xl font-bold leading-tight text-white">
          هل أنت مستعد لتجربة شراء قطع الغيار المثالية؟
        </h2>
        
        <p className="max-w-2xl text-xl text-blue-100">
          انضم الآن إلى آلاف العملاء الراضين واستمتع بتجربة شراء سلسة وموثوقة
        </p>
        
        {/* Button */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to="/login"
            className="px-8 py-4 text-lg font-bold text-blue-700 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            ابدأ الآن
          </Link>
          <Link
            to="/search"
            className="px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cta;