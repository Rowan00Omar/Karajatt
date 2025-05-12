import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SearchForm from "./components/SearchForm";
import SellerUpload from "./pages/SellerUpload";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetail";
import Signup from "./pages/Signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload-part" element={<SellerUpload />} />
            <Route path="find-part" element={<SearchForm />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/part/:id" element={<ProductDetail />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
      {/* <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider> */}
    </div>
  );
}

export default App;
