"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Chart as AreaChart } from "../components/Area";
import { Chart as AreaChartNew } from "@/components/AreaNew";
import { Chart as BarChart } from "@/components/Bar";
import AdminBar from "@/components/AdminBar";
import { Chart as PieChart } from "@/components/Pie";
import { AdminSectionCard } from "@/components/AdminSectionCard";
import { Area } from "recharts";
const AdminDash = () => {
  return (
    <div className="flex h-screen w-full">
      <main className="w-full items-center">
        <div className="flex flex-1 flex-col space-y-5 min-w-0 justify-center items-center   ">
          <div className="w-full max-w-2/3 h-auto pt-5 ">
            <AreaChartNew />
          </div>
          <div className="flex md:flex-row flex-col w-full max-w-2/3 justify-between ">
            <BarChart />
            <BarChart />
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDash;
