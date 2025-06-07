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
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import useLogout from "@/hooks/useLogout";

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
        className={`fixed inset-y-0 right-0 z-40 w-[240px] bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full py-4" dir="rtl">
          <div className="px-4 mb-4">
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1 px-2">
              {items.map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-gray-100"
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

          <div className="px-4 mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 text-right"
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
