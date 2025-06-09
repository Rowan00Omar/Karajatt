import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: "",
    expiry_date: "",
    is_active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingCoupon) {
        await axios.put(`/api/coupons/${editingCoupon.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/coupons", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCoupons();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving coupon:", err);
      alert(err.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
      alert(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_percentage: coupon.discount_percentage,
      expiry_date: new Date(coupon.expiry_date).toISOString().split("T")[0],
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_percentage: "",
      expiry_date: "",
      is_active: true,
    });
    setEditingCoupon(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        <p className="text-xl font-semibold mb-2">خطأ</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">إدارة الكوبونات</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>إضافة كوبون</span>
        </button>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{coupon.code}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  خصم {coupon.discount_percentage}%
                </p>
                <p className="text-gray-500 text-sm">
                  ينتهي في:{" "}
                  {new Date(coupon.expiry_date).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    coupon.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.is_active ? "نشط" : "غير نشط"}
                </span>
                <button
                  onClick={() => handleEdit(coupon)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCoupon ? "تعديل كوبون" : "إضافة كوبون جديد"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رمز الكوبون
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_percentage: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded text-indigo-600"
                />
                <label className="text-sm text-gray-700">نشط</label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingCoupon ? "تحديث" : "إضافة"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
