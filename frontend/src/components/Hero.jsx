import React from "react";
import HeroImage from "../assets/Hero1.jpg";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section id="Hero">
      <div className="container flex flex-col-reverse items-center px-6 mx-auto mt-10 space-y-0 md:flex-row">
        {/* Image */}
        <div className="md:w-1/2">
          <img src={HeroImage} alt="" />
        </div>
        {/* Right Item */}
        <div
          className="flex flex-col mb-32 items-center space-y-12 md:w-1/2 pt-[150px] "
          dir="rtl"
        >
          <h1 className="max-w-md text-4xl font-bold text-center md:text-5xl">
            منصة واحدة لكل ما تحتاجه سيارتك
          </h1>

          <p className="max-w-sm text-center text-darkGrayishBlue">
            كراجات يجمع كل ما تحتاجه سيارتك في مكان واحد لجعل اقتناء قطع الغيار
            اسهل من اي وقت مضى
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              to="/login"
              className="p-3 px-6 pt-2 text-white bg-babyJanaBlue rounded-full baseline hover:bg-babyJanaBlue"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
