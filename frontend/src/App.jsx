import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import AdminLayout from "./pages/admin/layout";
import AdminPage from "./pages/admin/page";
import SalesPage from "./pages/admin/sales";
import InventoryPage from "./pages/admin/inventory";
import UsersPage from "./pages/admin/users";
import ManageUsersPage from "./pages/admin/manage";
import PendingRequestsPage from "./pages/admin/pending";
import SellerLayout from "./pages/seller/layout";
import SellerUpload from "./pages/SellerUpload";
import SearchForm from "./components/SearchForm";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import axios from "axios";
import ProductDetail from "./pages/ProductDetail";
import SellerProfile from "./pages/SellerProfile";

const UserLayout = ({ children, showNavbar = true }) => {
  const currentRole = localStorage.getItem("userRole");
  const shouldShowNavbar = showNavbar && currentRole !== "seller";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {shouldShowNavbar && <Navbar />}
        {children}
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      const cachedRole = localStorage.getItem("userRole");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newRole = res.data.role;
        setRole(newRole);
        if (newRole !== cachedRole) {
          localStorage.setItem("userRole", newRole);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const RoleBasedRedirect = () => {
    const currentRole = role || localStorage.getItem("userRole");

    switch (currentRole) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "seller":
        return <Navigate to="/seller" replace />;
      case "user":
        return <Navigate to="/user" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  const ProtectedRoute = ({ children, allowedRole }) => {
    const currentRole = role || localStorage.getItem("userRole");
    if (!currentRole) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRole && currentRole !== allowedRole) {
      return <Navigate to={`/${currentRole}`} replace />;
    }
    return children;
  };

  const HomeRoute = () => {
    const currentRole = role || localStorage.getItem("userRole");

    if (currentRole) {
      switch (currentRole) {
        case "admin":
          return <Navigate to="/admin" replace />;
        case "seller":
          return <Navigate to="/seller" replace />;
        case "user":
          return <Navigate to="/user" replace />;
      }
    }

    return (
      <UserLayout>
        <SearchForm />
      </UserLayout>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/part/:id"
          element={
            <UserLayout>
              <ProductDetail />
            </UserLayout>
          }
        />
        <Route
          path="/seller-profile/:id"
          element={
            <UserLayout>
              <SellerProfile />
            </UserLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="manage" element={<ManageUsersPage />} />
          <Route path="pending" element={<PendingRequestsPage />} />
        </Route>

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerUpload />} />
          <Route path="my-products" element={<div>My Products</div>} />
          <Route path="orders" element={<div>Orders</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>

        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout>
                <div className="min-h-screen bg-gray-50">
                  <main className="pt-16 md:pt-20">
                    <Routes>
                      <Route index element={<SearchForm />} />
                      <Route path="orders" element={<div>My Orders</div>} />
                      <Route path="part/:id" element={<ProductDetail />} />
                    </Routes>
                  </main>
                </div>
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<HomeRoute />} />

        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
