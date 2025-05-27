import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
    <>
      <div className="min-h-screen  flex flex-col">
        <main className="pb-10">
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/ProductDetail" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<ProtectedSearchForm />} />
              <Route path="/adminHome" element={<ProtectedAdminHome />} />
              <Route path="/sellerHome" element={<ProtectedSellerHome />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </CartProvider>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
