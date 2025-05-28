import React from "react";

const Footer = () => {
  return (
    <div>
      {" "}
      <footer className="bg-veryDarkBlue">
        {/* Flex Container */}
        <div className="container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:space-y-0">
          {/* Logo and social media Links */}
          <div className="flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start">
            <div className="mx-auto my-3 text-center text-white md:hidden">
              حقوق الملكية &copy; 2025, كل الحقوق محفوظة
            </div>
            {/* Logo */}
            <div>
              <img className="h-8 my-8 md:my-0" alt="" />
            </div>
            {/* Social Links Container */}
            <div className="flex justify-center space-x-4">
              {/* Link 1 */}
              <a href="#">
                <img className="h-8" alt="" />
              </a>
              {/* Link 2 */}
              <a href="#">
                <img className="h-8" alt="" />
              </a>
              {/* Link 3 */}
              <a href="#">
                <img className="h-8" alt="" />
              </a>
              {/* Link 4 */}
              <a href="#">
                <img className="h-8" alt="" />
              </a>
              {/* Link 5 */}
              <a href="#">
                <img className="h-8" alt="" />
              </a>
            </div>
          </div>
          {/* List Container */}
          <div className="flex justify-around space-x-32 my-8 md:my-0">
            <div className="flex flex-col space-y-3 text-white">
              <a className="hover:text-babyJanaBlue">الرئيسية</a>
              <a className="hover:text-babyJanaBlue">المنتجات</a>
            </div>
            <div className="flex flex-col space-y-3 text-white">
              <a className="hover:text-babyJanaBlue">من نحن؟</a>
              <a className="hover:text-babyJanaBlue">سياسات الخصوصية</a>
            </div>
          </div>
          {/* Input Container */}
          <div className="flex flex-col justify-between">
            <form>
              <div className="flex space-x-3">
                <input
                  type="text"
                  className="flex-1 px-4 rounded-full bg-white focus:outline-none"
                  placeholder="احصل على كل جديد في صندوق بريدك"
                />
                <button className="px-6 py-2 text-white rounded-full bg-babyJanaBlue focus:outline-none">
                  اذهب الآن
                </button>
              </div>
            </form>
            <div className="hidden text-white md:block">
              حقوق الملكية &copy; 2025, كل الحقوق محفوظة
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
