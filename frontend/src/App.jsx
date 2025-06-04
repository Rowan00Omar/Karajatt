import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/layout";
import AdminPage from "./pages/admin/page";
import SalesPage from "./pages/admin/sales";
import InventoryPage from "./pages/admin/inventory";
import UsersPage from "./pages/admin/users";
import LandingPage from "./pages/LandingPage";
import { CartProvider } from "./context/CartContext";
import ManageUsersPage from "./pages/admin/manage";
import PendingRequestsPage from "./pages/admin/pending";
import Login from "./pages/Login";
import SellerLayout from "./pages/seller/layout";
import BestSellingPage from "./pages/seller/best-selling";
import SalesReportPage from "./pages/seller/sales-report";
import PaymentInfoPage from "./pages/seller/payment-info";
import SellerInventoryPage from "./pages/seller/inventory";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="manage" element={<ManageUsersPage />} />
          <Route path="pending" element={<PendingRequestsPage />} />
        </Route>
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="best-selling" element={<BestSellingPage />} />
          <Route path="sales-report" element={<SalesReportPage />} />
          <Route path="payment-info" element={<PaymentInfoPage />} />
          <Route path="inventory" element={<SellerInventoryPage />} />
        </Route>
        <Route path="login" element={<Login/>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
