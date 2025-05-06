import React from "react";
import {
  Home,
  Search,
  User,
  ShoppingBag,
  MessageCircleMore,
  ChevronDown,
} from "lucide-react";
const Navbar = () => {
  return (
    <>
      {/* Desktop Nav */}

      <nav className="hidden md:flex container w-3/5 fixed justify-between bg-babyJanaBlue/15  items-center p-6 ">
        <div className="flex justify-between items-center float-left space-x-6">
          <a href="#" className="hover:text-lightGray text-white">
            <User />
          </a>
          <a href="#" className="hover:text-lightGray text-white">
            <ShoppingBag />
          </a>
          <a href="#" className="hover:text-lightGray text-white">
            <Search />
          </a>
        </div>
        <div className="flex flex-row justify-between items-center space-x-10">
          <a
            href="#"
            className="flex hover:text-lightGray text-white font-black text-xl"
          >
            محادثات <ChevronDown />
          </a>
          <a
            href="#"
            className="flex hover:text-lightGray text-white font-black text-xl"
          >
            اكتشف <ChevronDown />
          </a>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full shadow-sm border-t border-gray-600 z-50">
        <div className="flex justify-around items-center h-16">
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray"
          >
            <Home />
          </a>
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray"
          >
            <MessageCircleMore />
          </a>
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray"
          >
            <ShoppingBag />
          </a>
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray"
          >
            <User />
          </a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
