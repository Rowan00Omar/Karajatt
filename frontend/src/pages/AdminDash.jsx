"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Chart as AreaChart } from "../components/Area";
import { Chart as AreaChartNew } from "@/components/AreaNew";
import { Chart as BarChart } from "@/components/Bar";
import AdminBar from "@/components/AdminBar";
import { Chart as PieChart } from "@/components/Pie";
import { AdminSectionCard } from "@/components/AdminSectionCard";

const AdminDash = () => {
  return (
    <div className="flex h-screen w-full">
      <SidebarProvider>
        <div className="flex w-full">
          <AdminBar />
          <main className="flex-1 overflow-y-auto p-6 mr-[240px]">
            {/* المبيعات والطلبات */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-right">المبيعات والطلبات</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* إجمالي المبيعات */}
                <div className="lg:col-span-2">
                  <AreaChartNew />
                </div>
                {/* عدد الطلبات الكلي */}
                <AdminSectionCard 
                  title="عدد الطلبات الكلي"
                  value="1,234"
                  trend="+12.5%"
                  description="إجمالي الطلبات حتى الآن"
                />
                {/* أكثر القطع مبيعًا */}
                <div>
                  <PieChart type="mostSold" />
                </div>
              </div>
            </section>

            {/* المخزون والمنتجات */}
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-right">المخزون والمنتجات</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* كميات المخزون الحالية */}
                <AdminSectionCard 
                  title="كميات المخزون الحالية"
                  value="523"
                  trend="-5.2%"
                  description="القطع التي على وشك النفاد أو منتهية"
                />
                {/* عدد المنتجات الجديدة المُضافة */}
                <AdminSectionCard 
                  title="المنتجات الجديدة"
                  value="45"
                  trend="+8.3%"
                  description="المنتجات المضافة هذا الشهر"
                />
              </div>
            </section>

            {/* المستخدمون والسلوك */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-right">المستخدمون والسلوك</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* إجمالي عدد المستخدمين والمستخدمين النشطين */}
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
                {/* عدد التسجيلات الجديدة */}
                <div>
                  <BarChart type="registrations" />
                </div>
                {/* أكثر القطع التي يتم البحث عنها */}
                <div>
                  <PieChart type="mostSearched" />
                </div>
                {/* عدد الزيارات */}
                <div className="lg:col-span-2">
                  <BarChart type="visits" />
                </div>
              </div>
            </section>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminDash;
