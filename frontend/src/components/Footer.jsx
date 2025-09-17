// Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Home, ShoppingBag, Book, Phone, MapPin } from "lucide-react";
import { FaTiktok, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import Logo from "@/assets/LogoNoBack.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container px-6 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Social Media */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="mb-4">
              <img
                src={Logo}
                className="h-10 w-auto"
                alt="Karajat Logo"
              />
            </div>
            
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://www.tiktok.com/@1.karjatt?is_from_webapp=1&sender_device=pc"
                className="bg-gray-800 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok className="text-sm" />
              </a>
              <a
                href="https://x.com/1_Karjatt"
                className="bg-gray-800 hover:bg-blue-400 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://www.instagram.com/1.karjatt/?utm_source=ig_web_button_share_sheet"
                className="bg-gray-800 hover:bg-pink-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-sm" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">روابط سريعة</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/"
                      className="hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                    >
                      <Home className="w-3 h-3" />
                      الرئيسية
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/search"
                      className="hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      المنتجات
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">السياسات</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/seller-policy"
                      className="hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                    >
                      <Book className="w-3 h-3" />
                      سياسات البائع
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/delivery-policy"
                      className="hover:text-blue-400 transition-colors text-sm flex items-center gap-1"
                    >
                      <Book className="w-3 h-3" />
                      سياسات التوصيل
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="text-center md:text-start">
            <h3 className="text-sm font-semibold text-white mb-2">معلومات التواصل</h3>
            <div className="space-y-1" dir="ltr">
              <a
                href="mailto:Karjattoffical@gmail.com"
                className="flex items-center gap-1 hover:text-blue-400 transition-colors text-sm justify-center md:justify-start"
              >
                <Mail className="w-3 h-3" />
                Karjattoffical@gmail.com
              </a>
              <div className="flex items-center gap-1 text-sm justify-center md:justify-start">
                <Phone className="w-3 h-3" />
                +966 50 123 4567
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center">
          <div className="text-xs text-gray-400">
            حقوق الملكية &copy; 2025, كراجات. كل الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;