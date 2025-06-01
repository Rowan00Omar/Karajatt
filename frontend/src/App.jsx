import { Routes, Route } from "react-router-dom";
import AdminLayout from "./app/admin/layout";
import AdminPage from "./app/admin/page";
import SalesPage from "./app/admin/sales/page";
import InventoryPage from "./app/admin/inventory/page";
import UsersPage from "./app/admin/users/page";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
