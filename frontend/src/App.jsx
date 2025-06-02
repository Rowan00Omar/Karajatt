import { Routes, Route, Navigate, Link } from "react-router-dom";
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

// Layout wrapper for pages that need footer
const UserLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>
);

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

  const ProtectedRoute = ({ children }) => {
    const currentRole = role || localStorage.getItem("userRole");
    if (!currentRole) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public routes that should be accessible without redirection */}
        <Route
          path="/part/:id"
          element={
            <UserLayout>
              <Navbar />
              <ProductDetail />
            </UserLayout>
          }
        />
        <Route
          path="/seller-profile/:id"
          element={
            <UserLayout>
              <Navbar />
              <SellerProfile />
            </UserLayout>
          }
        />

        {/* Admin routes */}
        {role === "admin" && (
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
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
        )}

        {/* Seller routes */}
        {role === "seller" && (
          <Route
            path="/seller"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <SellerLayout />
                </UserLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerUpload />} />
            <Route path="my-products" element={<div>My Products</div>} />
            <Route path="orders" element={<div>Orders</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        )}

        {/* User routes */}
        {role === "user" && (
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
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
        )}

        {/* Home route */}
        <Route
          path="/"
          element={
            <UserLayout>
              <Navbar />
              <SearchForm />
            </UserLayout>
          }
        />

        {/* Catch all - redirect to appropriate home based on role or login */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
