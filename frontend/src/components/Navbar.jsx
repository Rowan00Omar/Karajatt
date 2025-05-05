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
      <nav className="hidden md:flex container w-2/5 fixed justify-between items-center ">
        <div className="flex justify-between items-center float-left space-x-6">
          <a href="#" className="hover:text-lightGray">
            <User />
          </a>
          <a href="#" className="hover:text-lightGray">
            <ShoppingBag />
          </a>
          <a href="#" className="hover:text-lightGray">
            <Search />
          </a>
        </div>
        <div className="flex flex-row justify-between items-center space-x-10">
          <a href="#" className="flex hover:text-lightGray">
            Chat <ChevronDown />
          </a>
          <a href="#" className="flex hover:text-lightGray">
            Explore <ChevronDown />
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
