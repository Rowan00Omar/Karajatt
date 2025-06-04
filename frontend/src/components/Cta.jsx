import React from "react";
import { Link } from "react-router-dom";
const Cta = () => {
  return (
    <div>
      <section id="cta" className="bg-babyJanaBlue">
        {/* Flex Container */}
        <div className="container flex flex-col items-center justify-between px-6 py-24 mx-auto space-y-12 md:py-12 md:flex-row md:space-y-0">
          {/* Heading */}
          <h2 className="text-5xl font-bold leading-tight text-center text-white md:text-4xl md:max-w-xl md:text-left">
            احصل على كل ما تريد الآن
          </h2>
          {/* Button */}
          <Link
            to="/login"
            className="p-3 px-6 pt-2 text-babyJanaBlue bg-white rounded-full shadow-2xl baseline hover:bg-gray-500"
          >
            <button>ابدأ الآن</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cta;
