import { Chart as AreaChartNew } from "@/components/AreaNew";
import { Chart as PieChart } from "@/components/Pie";
import { AdminSectionCard } from "@/components/AdminSectionCard";

export default function SalesPage() {
  return (
    <section className="w-full">
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
  );
} 