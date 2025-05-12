"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Chart as AreaChart } from "../components/Area";
import { Chart as BarChart } from "@/components/Bar";
import AdminBar from "@/components/AdminBar";
import { Chart as PieChart } from "@/components/Pie";
import { AdminSectionCard } from "@/components/AdminSectionCard";
const AdminDash = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminBar className="w-[400px] h-full flex-shrink-0 border-r" />
        <main className="w-[750px]">
          <div className="flex-1 min-w-0 w-full  ">
            <div className="h-[50px] p-4">
              <AreaChart />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
export default AdminDash;
