import { Chart as BarChart } from "@/components/Bar";
import { Chart as PieChart } from "@/components/Pie";
import { AdminSectionCard } from "@/components/AdminSectionCard";

export default function UsersPage() {
  return (
    <section className="w-full animate-fadeIn">
      <h2 className="mb-4 text-2xl font-bold text-right">المستخدمون والسلوك</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminSectionCard
          title="إجمالي المستخدمين"
          value="3,721"
          trend="+15.2%"
          description="المستخدمين المسجلين"
        />
        <AdminSectionCard
          title="المستخدمين النشطين"
          value="892"
          trend="+5.7%"
          description="نشطين في آخر 30 يوم"
        />
        <div>
          <BarChart type="registrations" />
        </div>
        <div>
          <PieChart type="mostSearched" />
        </div>
        <div className="lg:col-span-2">
          <BarChart type="visits" />
        </div>
      </div>
    </section>
  );
}
