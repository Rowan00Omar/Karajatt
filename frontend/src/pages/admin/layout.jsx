import { SidebarProvider } from "@/components/ui/sidebar";
import AdminBar from "@/components/AdminBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full">
          <AdminBar />
          <main className="flex-1 min-h-screen w-full overflow-y-auto p-4 sm:p-6 md:p-8 mr-0 sm:mr-[240px] transition-all duration-300 ease-in-out pt-16 sm:pt-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-md w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
} 