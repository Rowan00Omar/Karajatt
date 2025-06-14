import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, User, MessageSquare, Trash } from "lucide-react";
import Reviews from "../components/Reviews";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(`/api/seller/profile/${id}`);
        setSeller(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch seller information"
        );
        console.error("Error fetching seller info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, [id]);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/sellers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Redirect to home or show success message
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!seller)
    return <div className="text-center py-8">لم يتم العثور على البائع</div>;

  return (
    <div
      className="max-w-7xl mx-auto pt-30 px-4 sm:px-6 lg:px-8 py-8"
      dir="rtl"
    >
      {/* Seller Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
            {seller.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
            <p className="text-gray-600">{seller.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">التقييم العام</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(seller.average_rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {seller.average_rating} من 5
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">عدد المنتجات</p>
            <p className="text-2xl font-semibold">{seller.total_products}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">عدد التقييمات</p>
            <p className="text-2xl font-semibold">{seller.total_reviews}</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">منتجات البائع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seller.products.map((product) => (
            <div
              key={product.product_id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image_url || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {product.title || product.part_name}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-semibold">
                    {product.price} ريال
                  </p>
                  <div className="flex items-center gap-1">
                    <Star
                      className={`w-4 h-4 ${
                        product.product_rating > 0
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {product.product_rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <Reviews type="seller" id={id} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              تأكيد حذف الحساب
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع
              عنه.
            </Dialog.Description>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                حذف الحساب
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SellerProfile;
