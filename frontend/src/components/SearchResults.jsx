import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";

const SearchResults = ({ results }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = (e, result) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = result.id;
    console.log("Clicking product:", {
      productId,
      result,
    });
    if (!productId) {
      console.error("No product ID found in result:", result);
      return;
    }
    navigate(`/user/part/${productId}`);
  };

  return (
    <div className="mt-8 px-4 w-full" dir="rtl">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        نتائج البحث{" "}
        <span className="text-gray-500">({results.length} قطعة)</span>
      </h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((result) => {
          console.log("Mapping result:", result);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              key={`product-${result.id}`}
              className="relative"
            >
              <div
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={(e) => handleProductClick(e, result)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      result.images && result.images.length > 0
                        ? result.images[0]
                        : "/placeholder.jpg"
                    }
                    alt={result.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {result.condition}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]">
                    {result.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{result.rating || "جديد"}</span>
                    </div>
                    <span>
                      {result.manufacturer} {result.model}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {result.price} ريال
                    </span>
                    <span className="text-sm text-gray-500">
                      {result.year_from} - {result.year_to}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, result)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة للسلة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              لا توجد نتائج
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              لم نتمكن من العثور على أي قطع غيار تطابق معايير البحث
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
