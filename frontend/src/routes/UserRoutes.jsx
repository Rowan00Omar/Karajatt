import ProductDetail from "@/pages/ProductDetail";
import SearchForm from "@/components/SearchForm";
import React from "react";
import Navbar from "@/components/Navbar";
import { Route, Routes } from "react-router-dom";
import PaymentResult from "../pages/PaymentResult";

const User = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/Home" element={<SearchForm />} />
          <Route path="/part/:id" element={<ProductDetail />} />
          <Route path="/user/payment/result" element={<PaymentResult />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default User;
