import ProductDetail from "@/pages/ProductDetail";
import SearchForm from "@/components/SearchForm";
import React from "react";
import Navbar from "@/components/Navbar";
import { Route, Routes } from "react-router-dom";
const User = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/Home" element={<SearchForm />} />
          <Route path="/part/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default User;
