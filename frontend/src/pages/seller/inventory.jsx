import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchInventory();
  }, [sortBy, sortOrder]);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/seller/inventory?sort=${sortBy}&order=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventory(response.data.products || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      toast.error("تم إلغاء الحذف");
      return;
    }

    try {
      setDeletingId(productId);
      const token = localStorage.getItem("token");
      await axios.delete(`/api/seller/inventory/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted product from the state
      setInventory(inventory.filter((item) => item.product_id !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.part_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "sold"
        ? item.status === "sold"
        : item.status !== "sold";

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>مخزون البائع</title>
      </Helmet>
      <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">المخزون</h2>
            <p className="mt-1 text-sm text-gray-500">عرض المنتجات المتوفرة</p>
          </div>
          <a
            href="/seller/upload"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            إضافة قطعة جديدة
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث في المخزون..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200 bg-white"
                >
                  <option value="all">جميع المنتجات</option>
                  <option value="available">المنتجات المتوفرة</option>
                  <option value="sold">المنتجات المباعة</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200 bg-white"
                >
                  <option value="created_at">تاريخ الإضافة</option>
                  <option value="price">السعر</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200 bg-white"
                >
                  <option value="desc">تنازلي</option>
                  <option value="asc">تصاعدي</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    القطعة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    السيارة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    السعر
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    حذف المنتج
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item) => (
                  <tr
                    key={item.product_id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p className="font-medium text-gray-900">{item.title || 'غير محدد'}</p>
                        <p className="text-sm text-gray-500">{item.part_name || 'غير محدد'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p className="text-gray-900">{item.company_name || 'غير محدد'}</p>
                        <p className="text-sm text-gray-500">{item.car_name || 'غير محدد'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-medium text-gray-900">
                        {item.price ? `${item.price} ر.س` : 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.approval_status === "approved"
                              ? "bg-green-100 text-green-800"
                              : item.approval_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.approval_status === "approved"
                            ? "معتمد"
                            : item.approval_status === "pending"
                            ? "قيد المراجعة"
                            : "مرفوض"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "sold"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status === "sold" ? "مباع" : "متوفر"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.product_id)}
                        disabled={deletingId === item.product_id}
                        className={`text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50 ${
                          deletingId === item.product_id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title="حذف المنتج"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInventory.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">لا توجد منتجات</p>
              <p className="text-sm">قم بإضافة منتجات جديدة لعرضها هنا</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
