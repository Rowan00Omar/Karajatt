import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/layout";
import AdminPage from "./pages/admin/page";
import SalesPage from "./pages/admin/sales";
import InventoryPage from "./pages/admin/inventory";
import UsersPage from "./pages/admin/users";
import LandingPage from "./pages/LandingPage";
import { CartProvider } from "./context/CartContext";
import ManageUsersPage from "./pages/admin/manage";

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
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
