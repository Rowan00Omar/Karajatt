// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, ChevronDown, LogOut, ShoppingBag, Menu, X } from "lucide-react";
import CartButton from "./CartButton";
import useLogout from "@/hooks/useLogout.jsx";
import Logo from "@/assets/LogoNoBack.png";

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="hidden md:flex fixed justify-between bg-gray-900 items-center top-0 left-0 right-0 w-full px-6 py-3 z-40 border-b border-gray-800">
        {/* اللوجو على اليمين */}
        <div className="flex items-center">
          {userRole ? (
            <Link to="/user">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-auto transition-all hover:scale-105"
              />
            </Link>
          ) : (
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-auto transition-all hover:scale-105"
              />
            </Link>
          )}
        </div>
        
        {/* الروابط في المنتصف */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-white font-medium transition-colors"
          >
            الرئيسية
          </Link>
          <Link
            to="/search"
            className="text-gray-300 hover:text-white font-medium transition-colors"
          >
            المنتجات
          </Link>
        
        </div>
        
        {/* الأيقونات على الشمال */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/search")}
            className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <div className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer">
            <CartButton />
          </div>
          <button
            onClick={handleProfileClick}
            className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={logout}
            className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 w-full bg-gray-900 z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-auto transition-all hover:scale-105"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-gray-800 border-t border-gray-700 py-4 px-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-300 hover:text-white font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/search"
                className="text-gray-300 hover:text-white font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              <div className="flex items-center justify-between pt-3 border-t border-gray-700 mt-2">
                <button
                  onClick={() => {
                    navigate("/search");
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                <div className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer">
                  <CartButton />
                </div>
                <button
                  onClick={(e) => {
                    handleProfileClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors p-2 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;