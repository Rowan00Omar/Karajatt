import React, { useEffect, useState, Suspense } from "react";
import { CartProvider } from "./context/CartContext";
import { Route,Routes,Router,Navigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = React.lazy(() => import("./pages/admin/layout"));
const SalesPage = React.lazy(() => import("./pages/admin/sales"));
const InventoryPage = React.lazy(() => import("./pages/admin/inventory"));
const SellerInventory = React.lazy(() => import("./pages/seller/inventory"));
const UsersPage = React.lazy(() => import("./pages/admin/users"));
const ManageUsersPage = React.lazy(() => import("./pages/admin/manage"));
const PendingRequestsPage = React.lazy(() => import("./pages/admin/pending"));
const InspectionManagement = React.lazy(() => import("./pages/admin/InspectionManagement"));
const SellerLayout = React.lazy(() => import("./pages/seller/layout"));
const SellerUpload = React.lazy(() => import("./pages/SellerUpload"));
const SearchForm = React.lazy(() => import("./components/SearchForm"));
const Navbar = React.lazy(() => import("./components/Navbar"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Footer = React.lazy(() => import("./components/Footer"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const SellerProfile = React.lazy(() => import("./pages/SellerProfile"));
const SalesReportPage = React.lazy(() => import("./pages/seller/sales-report"));
const Profile = React.lazy(() => import("./pages/seller/Profile"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const CouponsPage = React.lazy(() => import("./pages/admin/coupons"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetForgottenPassword = React.lazy(() => import("./pages/ResetForgottenPassword"));
const SellersManagementPage = React.lazy(() => import("./pages/admin/sellers"));
const PaymentResult = React.lazy(() => import("./pages/PaymentResult"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const BillingForm = React.lazy(() => import("./pages/BillingForm"));
const SellerPolicy = React.lazy(()=> import('./components/SellerPolicy'));
const DeliveryPolicy = React.lazy(()=> import('./components/DeliveryPolicy'));
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

      if (!token) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newRole = res.data.role;
        setRole(newRole);
        // Always update localStorage with the server response
        localStorage.setItem("userRole", newRole);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for authentication changes
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setRole(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        fetchUserInfo();
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleAuthChange);
    
    // Also listen for custom auth change events
    window.addEventListener('authChange', handleAuthChange);

    fetchUserInfo();

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
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
        default:
          return <Navigate to="/login" replace />;
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
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
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
            path="/seller"
            element={
              <ProtectedRoute allowedRole="seller">
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="upload" element={<SellerUpload />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="sales-report" element={<SalesReportPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="sales" replace />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="manage" element={<ManageUsersPage />} />
            <Route path="sellers" element={<SellersManagementPage />} />
            <Route path="pending" element={<PendingRequestsPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="inspection" element={<InspectionManagement />} />
          </Route>

          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRole="user">
                <UserLayout>
                  <div className="min-h-screen bg-gray-50">
                    <main>
                      <Routes>
                        <Route index element={<SearchForm />} />
                        <Route path="orders" element={<div>My Orders</div>} />
                        <Route path="part/:id" element={<ProductDetail />} />
                        <Route path="profile" element={<UserProfile />} />
                        <Route
                          path="payment/result"
                          element={<PaymentResult />}
                        />
                      </Routes>
                    </main>
                  </div>
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<LandingPage />} />
          <Route path="/seller-policy" element={<SellerPolicy/>}/>
          <Route path="/delivery-policy" element={<DeliveryPolicy/>}/>
          {/* Public seller profile route */}
          <Route
            path="/seller/:id"
            element={
              <UserLayout>
                <SellerProfile />
              </UserLayout>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-forgotten-password/:token"
            element={
              <ProtectedRoute>
                <ResetForgottenPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingForm />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route
            path="/search"
            element={
              <UserLayout>
                <SearchForm />
              </UserLayout>
            }
          />

          {/* Protected Product Routes */}
          <Route
            path="/part/:id"
            element={
              <ProtectedRoute>
                <UserLayout>
                  <ProductDetail />
                </UserLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </CartProvider>
  );
}

export default App;
