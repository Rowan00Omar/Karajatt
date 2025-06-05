import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Calendar, Tag, Car } from "lucide-react";

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
    if (!productId) {
      console.error("No product ID found in result:", result);
      return;
    }
    navigate(`/user/part/${productId}`);
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          نتائج البحث{" "}
          <span className="text-blue-600">({results.length} قطعة)</span>
        </h2>
        <p className="mt-2 text-gray-600">اختر القطعة المناسبة من النتائج التالية</p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((result, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={`product-${result.id}`}
            className="relative group"
          >
            <div
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform group-hover:scale-[1.02]"
              onClick={(e) => handleProductClick(e, result)}
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={result.images?.[0] || "/placeholder.jpg"}
                  alt={result.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 space-y-2">
                  <span className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    {result.condition}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                  {result.title}
                </h3>

                <div className="space-y-3">
                  {/* Car Info */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car className="w-4 h-4" />
                    <span className="text-sm">
                      {result.manufacturer} {result.model}
                    </span>
                  </div>

                  {/* Year Range */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {result.year_from} - {result.year_to}
                    </span>
                  </div>

                  {/* Rating */}
                  {result.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(result.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{result.rating}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      {result.price} ريال
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, result)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>إضافة للسلة</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-3xl p-12 max-w-lg mx-auto shadow-xl">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600">
              لم نتمكن من العثور على أي قطع غيار تطابق معايير البحث
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
