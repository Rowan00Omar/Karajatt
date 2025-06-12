import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, ChevronDown, LogOut } from "lucide-react";
import CartButton from "./CartButton";
import useLogout from "@/hooks/useLogout";
import Logo from "@/assets/LogoNoBack.png";

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
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed justify-between bg-gradient-to-b from-gray-900 to-gray-800 items-center top-0 left-0 right-0 w-full px-6 py-4 z-40 border-b border-gray-700">
        <div className="w-[144px]"></div>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img
            src={Logo}
            alt="Khaliji Logo"
            className="h-16 w-auto transition-all hover:scale-105 hover:brightness-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          />
        </Link>

        <div className="flex items-center space-x-4">
          <div className="text-gray-400 hover:text-white transition-colors p-2 cursor-pointer">
            <CartButton />
          </div>
          <button
            onClick={handleProfileClick}
            className="text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <User className="w-6 h-6" />
          </button>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full shadow-lg border-t border-gray-700 z-50 bg-gradient-to-t from-gray-900 to-gray-800">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">الرئيسية</span>
          </Link>
          <div className="flex flex-col items-center text-gray-400 hover:text-white transition-colors p-2 cursor-pointer">
            <CartButton />
            <span className="text-xs mt-1">السلة</span>
          </div>
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">حسابي</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
