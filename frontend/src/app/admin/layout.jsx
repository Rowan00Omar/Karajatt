import { SidebarProvider } from "@/components/ui/sidebar";
import AdminBar from "@/components/AdminBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full">
      <SidebarProvider>
        <div className="flex w-full">
          <AdminBar />
          <main className="flex-1 overflow-y-auto p-6 mr-[240px]">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
} 