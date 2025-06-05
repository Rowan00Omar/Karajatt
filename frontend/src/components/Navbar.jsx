import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  User,
  MessageCircleMore,
  ChevronDown,
  Bell,
  LogOut,
} from "lucide-react";
import CartButton from "./CartButton";
import useLogout from "@/hooks/useLogout";

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/login");
      return;
    }

    navigate("/user/profile");
    return;
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed justify-between bg-indigo-500 items-center top-0 left-0 right-0 w-full p-4 z-50 shadow-md">
        <div className="flex flex-row space-x-10">
          <a
            href="#"
            className="flex items-center hover:text-lightGray text-white font-black text-xl"
          >
            محادثات <ChevronDown className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="flex items-center hover:text-lightGray text-white font-black text-xl"
          >
            اكتشف <ChevronDown className="w-5 h-5" />
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hover:text-lightGray text-white p-2">
            <CartButton />
          </div>
          <button
            onClick={handleProfileClick}
            className="hover:text-lightGray text-white p-2"
          >
            <User className="w-6 h-6" />
          </button>
          <button
            onClick={logout}
            className="hover:text-lightGray text-white p-2"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full shadow-lg border-t border-gray-200 z-50 bg-white">
        <div className="flex justify-around items-center h-16">
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray p-2"
          >
            <Home className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="flex flex-col items-center text-gray-600 hover:text-lightGray p-2"
          >
            <MessageCircleMore className="w-6 h-6" />
          </a>
          <div className="flex flex-col items-center text-gray-600 hover:text-lightGray p-2">
            <CartButton />
          </div>
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center text-gray-600 hover:text-lightGray p-2"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
