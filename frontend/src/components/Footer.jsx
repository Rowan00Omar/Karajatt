import React from "react";
import { Link } from "react-router-dom";
import { Mail, Home, ShoppingBag ,Book} from "lucide-react";

import { FaTiktok, FaTwitter, FaInstagram } from "react-icons/fa";
import Logo from "@/assets/LogoNoBack.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="container flex flex-col-reverse justify-between px-6 py-12 mx-auto space-y-8 md:flex-row md:space-y-0 max-w-6xl">
        {/* Logo and Social Media */}
        <div className="flex flex-col-reverse items-center justify-between space-y-8 md:flex-col md:space-y-0 md:items-start">
          <div className="mx-auto my-3 text-center text-gray-400 text-sm md:hidden">
            حقوق الملكية &copy; 2025, كل الحقوق محفوظة
          </div>
          <div>
            <img
              src={Logo}
              className="h-12 my-6 md:my-0 opacity-90 hover:opacity-100 transition-opacity"
              alt="Karajat Logo"
            />
          </div>
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mt-6 text-xl">
            <a
              href="https://www.tiktok.com/@1.karjatt?is_from_webapp=1&sender_device=pc"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
            <a
              href="https://x.com/1_Karjatt"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/1.karjatt/?utm_source=ig_web_button_share_sheet"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex justify-around space-x-32 my-8 md:my-0 md:mx-12">
          <div className="flex flex-col space-y-4 text-gray-300">
            <Link
              to="/"
              className="hover:text-babyJanaBlue transition-colors flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </Link>
            <Link
              to="/search"
              className="hover:text-babyJanaBlue transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              المنتجات
            </Link>
            
          </div>
          <div className="flex flex-col space-y-4 text-gray-300">
            <Link
              to="/seller-policy"
              className="hover:text-babyJanaBlue transition-colors flex items-center gap-2"
            >
              <Book className="w-5 h-5" />
              سياسات البائع
            </Link>
            <Link
              to="/delivery-policy"
              className="hover:text-babyJanaBlue transition-colors flex items-center gap-2"
            >
              <Book className="w-5 h-5" />
              سياسات التوصيل
            </Link>
            
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-between text-gray-300 space-y-4 md:space-y-2">
          <div
            className="text-center md:text-right bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm"
            dir="rtl"
          >
            <span>للاستفسارات أو المشاكل، راسلنا على</span>
            <a
              href="mailto:Karjattoffical@gmail.com"
              dir="ltr"
              className="text-babyJanaBlue hover:text-blue-400 transition-colors flex items-center gap-2 justify-center md:justify-start mt-2"
            >
              <Mail className="w-5 h-5" />
              Karjattoffical@gmail.com
            </a>
          </div>
          <div className="hidden md:block text-sm text-gray-400">
            حقوق الملكية &copy; 2025, كل الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
