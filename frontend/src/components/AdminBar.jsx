import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  BadgeDollarSign,
  Warehouse,
  User,
  PanelRightOpen,
  PanelLeftOpen,
  Menu,
  X,
  Users,
  ClipboardCheck,
  LogOut,
  Ticket,
  Store,
  KeyRound,
} from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import useLogout from "@/hooks/useLogout";
import Logo from "@/assets/Logo.svg";

const items = [
  {
    title: "المبيعات و الطلبات",
    path: "/admin/sales",
    icon: BadgeDollarSign,
  },
  {
    title: "المخزون والمنتجات",
    path: "/admin/inventory",
    icon: Warehouse,
  },
  {
    title: "المستخدمون و السلوك",
    path: "/admin/users",
    icon: User,
  },
  {
    title: "إدارة المستخدمين",
    path: "/admin/manage",
    icon: Users,
  },
  {
    title: "إدارة البائعين",
    path: "/admin/sellers",
    icon: Store,
  },
  {
    title: "الطلبات المعلقة",
    path: "/admin/pending",
    icon: ClipboardCheck,
  },
  {
    title: "إدارة الكوبونات",
    path: "/admin/coupons",
    icon: Ticket,
  },
  {
    title: "فحص الطلبات",
    path: "/admin/inspection",
    icon: Search,
  },
];

export function AdminBar({ isOpen }) {
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
        }`}
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
            <Link
              to={`/reset-password/${localStorage.getItem("token")}`}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-indigo-600 hover:bg-indigo-50 text-right mb-2"
            >
              <KeyRound className="h-5 w-5" />
              <span>تغيير كلمة المرور</span>
            </Link>
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

export default AdminBar;
