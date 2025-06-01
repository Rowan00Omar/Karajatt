import { AdminSectionCard } from "@/components/AdminSectionCard";

export default function InventoryPage() {
  return (
    <section className="w-full">
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
  );
} 