import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Warehouse, User, Users } from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "المبيعات و الطلبات",
      path: "/admin/sales",
      icon: BadgeDollarSign,
      description: "إدارة المبيعات والطلبات وتتبع الأداء"
    },
    {
      title: "المخزون والمنتجات",
      path: "/admin/inventory",
      icon: Warehouse,
      description: "إدارة المخزون والمنتجات وتتبع الكميات"
    },
    {
      title: "المستخدمون و السلوك",
      path: "/admin/users",
      icon: User,
      description: "تحليل سلوك المستخدمين والإحصائيات"
    },
    {
      title: "إدارة المستخدمين",
      path: "/admin/manage",
      icon: Users,
      description: "إدارة حسابات المستخدمين والصلاحيات"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => (
        <button
          key={section.path}
          onClick={() => navigate(section.path)}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-right"
        >
          <div className="flex items-center justify-between mb-4">
            <section.icon className="h-8 w-8 text-indigo-600" />
            <h3 className="text-xl font-bold">{section.title}</h3>
          </div>
          <p className="text-gray-600">{section.description}</p>
        </button>
      ))}
    </div>
  );
} 