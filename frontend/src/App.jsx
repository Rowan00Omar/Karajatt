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
import AdminLayout from "./app/admin/layout";
import AdminPage from "./app/admin/page";
import SalesPage from "./app/admin/sales/page";
import InventoryPage from "./app/admin/inventory/page";
import UsersPage from "./app/admin/users/page";
import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchForm from "./components/SearchForm";
import AdminDash from "./pages/AdminDash";
import withAuthProtection from "./hoc/withAuthProtection";
import { CartProvider } from "./context/CartContext";
import SellerUpload from "./pages/SellerUpload";
import ProductDetail from "./components/ProductDetail";
import UserProfile from "./pages/UserProfile";
import SellerProfile from "./pages/SellerProfile";
import ManageUsers from "./pages/ManageUsers";
function App() {
  const [role, setRole] = useState(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch user role", err);
      }
    };

    fetchUserInfo();
  }, []);
  const ProtectedSearchForm = withAuthProtection(SearchForm, ["user"]);
  const ProtectedAdminHome = withAuthProtection(AdminDash, ["admin"]);
  const ProtectedSellerHome = withAuthProtection(SellerUpload, ["seller"]);
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
        <Route path="login" element={<Login />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
