import { Outlet } from "react-router-dom";
import SellerBar from "../../components/SellerBar";

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerBar />
      <main className="sm:mr-[240px] p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
} 