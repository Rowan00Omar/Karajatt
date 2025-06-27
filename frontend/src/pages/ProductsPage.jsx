import React from "react";
import { ProductProvider } from "../context/ProductContext";
import ProductList from "../components/ProductList";
import CategoryFilter from "../components/filters/CategoryFilter";
import CarModelFilter from "../components/filters/CarModelFilter";
import PriceFilter from "../components/filters/PriceFilter";
import ConditionFilter from "../components/filters/ConditionFilter";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet";

const ProductsPage = () => {
  return (
    <>
      <Helmet>
        <title>المنتجات</title>
      </Helmet>
      <ProductProvider>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            قطع الغيار المتاحة
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg mb-4">تصفية النتائج</h2>
                <CategoryFilter />
                <CarModelFilter />
                <PriceFilter />
                <ConditionFilter />
              </div>
            </div>

            {/* Products List */}
            <div className="w-full md:w-3/4">
              <ProductList />
            </div>
          </div>
        </div>
      </ProductProvider>
    </>
  );
};

export default ProductsPage;
