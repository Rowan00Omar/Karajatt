import {
  BarChart3,
  Package,
  Wallet,
  LineChart,
  Menu,
  X,
  User,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import useLogout from "@/hooks/useLogout";
import Logo from "@/assets/LogoNoBack.png";

const items = [
  {
    title: "الملف الشخصي",
    path: "/seller/profile",
    icon: User,
  },
  {
    title: "رفع منتج جديد",
    path: "/seller/upload",
    icon: Upload,
  },
  {
    title: "المخزون",
    path: "/seller/inventory",
    icon: Package,
  },
  {
    title: "تقرير المبيعات",
    path: "/seller/sales-report",
    icon: LineChart,
  },
];

export function SellerBar() {
  const logout = useLogout();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md sm:hidden hover:bg-gray-100 transition-colors"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar for both Mobile and Desktop */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-[280px] bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full sm:translate-x-0"
        } shadow-lg`}
      >
        <div className="flex flex-col h-full py-4" dir="rtl">
          <div className="px-6 mb-6">
            <Link to="/" className="flex items-center mb-6">
              <img src={Logo} alt="Khaliji Logo" className="h-8 w-auto" />
            </Link>
            <h2 className="text-xl font-bold text-gray-900">لوحة التحكم</h2>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1 px-3">
              {items.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-3 mt-auto border-t pt-4">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 text-right"
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerBar;
