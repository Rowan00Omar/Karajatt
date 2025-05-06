import React from "react";
import Hero from "../assets/Hero.jpg";
import Logo from "../assets/Logo.svg";
// `url(${Hero})`
const LandingPage = () => {
  return (
    <>
      <div className="flex justify-between">
        <div
          className="w-3/5 bg-cover bg-center min-h-screen text-white rounded-tr-lg rounded-br-lg"
          style={{
            backgroundImage: `url(${Hero})`,
          }}
        ></div>
        <div className="flex flex-col">
          <div className="mb-[100px]">Logo</div>
          <div className="flex flex-row items-center">
            <div className="text-lightGray font-black">كل ما تحتاجه سيارتك</div>
            <div className="h-[2px] w-[200px] rounded-full bg-lightGray ml-4 mr-16" />
          </div>
        </div>
      </div>
    </>
  );
};
export default LandingPage;
