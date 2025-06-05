import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, User, Building, CreditCard } from "lucide-react";
import Reviews from "../../components/Reviews";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    iban: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Get the seller ID from the token payload
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const sellerId = tokenPayload.id; // Assuming the ID is stored in the token payload

        const profileRes = await axios.get(`/api/seller/profile/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSeller(profileRes.data);
        setFormData({
          name: profileRes.data.name,
          email: profileRes.data.email,
          phone: profileRes.data.phone || "",
          address: profileRes.data.address || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch information");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const sellerId = tokenPayload.id;

      await axios.put(
        `/api/seller/profile/${sellerId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode(false);
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error("Error updating information:", err);
      alert(err.response?.data?.message || "Failed to update information");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/seller/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!seller) return <div className="text-center py-8">لم يتم العثور على البائع</div>;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Profile and Bank Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">الملف الشخصي والمعلومات البنكية</h2>
          <Button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            className="px-4 py-2"
          >
            {editMode ? "حفظ التغييرات" : "تعديل المعلومات"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">المعلومات الشخصية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">المعلومات البنكية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم البنك</label>
                <Input
                  type="text"
                  value={bankInfo.bankName}
                  onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحساب</label>
                <Input
                  type="text"
                  value={bankInfo.accountNumber}
                  onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editMode}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">التقييمات</h3>
        <Reviews type="seller" id={seller.id} />
      </div>

      {/* Delete Account Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          حذف الحساب
        </Button>
      </div>

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
              هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.
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

export default Profile; 