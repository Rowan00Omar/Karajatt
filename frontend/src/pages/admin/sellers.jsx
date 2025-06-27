import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Info } from "lucide-react";

export default function SellersManagementPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterProducts, setFilterProducts] = useState("all");

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setSellers(response.data.sellers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sellers data");
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === "all" ? true :
                         filterRating === "4+" ? (Number(seller.average_rating) || 0) >= 4 :
                         filterRating === "3-4" ? (Number(seller.average_rating) || 0) >= 3 && (Number(seller.average_rating) || 0) < 4 :
                         (Number(seller.average_rating) || 0) < 3;

    const matchesProducts = filterProducts === "all" ? true :
                          filterProducts === "10+" ? (Number(seller.total_products) || 0) >= 10 :
                          filterProducts === "5-10" ? (Number(seller.total_products) || 0) >= 5 && (Number(seller.total_products) || 0) < 10 :
                          (Number(seller.total_products) || 0) < 5;

    return matchesSearch && matchesRating && matchesProducts;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">خطأ</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Helmet>
        <title>إدارة البائعين</title>
      </Helmet>
    <div className="space-y-6">
      {/* Search and Filter Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن طريق الاسم أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">التقييم:</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">الكل</option>
                <option value="4+">4+ نجوم</option>
                <option value="3-4">3-4 نجوم</option>
                <option value="below3">أقل من 3 نجوم</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">عدد المنتجات:</label>
              <select
                value={filterProducts}
                onChange={(e) => setFilterProducts(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">الكل</option>
                <option value="10+">10+ منتجات</option>
                <option value="5-10">5-10 منتجات</option>
                <option value="below5">أقل من 5 منتجات</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">قائمة البائعين ({filteredSellers.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredSellers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              لا يوجد بائعين مطابقين لمعايير البحث
            </div>
          ) : (
            filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {seller.name}
                    </h3>
                    <p className="text-sm text-gray-500">{seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">المنتجات</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {seller.total_products || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">التقييم</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(Number(seller.average_rating) || 0).toFixed(1)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSeller(seller)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedSeller(null)}
            ></div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-right align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
              <div className="bg-white px-6 py-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      معلومات البائع
                    </h3>
                    <button
                      onClick={() => setSelectedSeller(null)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">تفاصيل كاملة عن معلومات البائع وإحصائياته</p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        المعلومات الشخصية
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium" dir="ltr">{selectedSeller.name || "غير متوفر"}</span>
                          <span className="text-gray-600">:الاسم</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium" dir="ltr">{selectedSeller.email || "غير متوفر"}</span>
                          <span className="text-gray-600">:البريد الإلكتروني</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium" dir="ltr">{selectedSeller.phone_number || "غير متوفر"}</span>
                          <span className="text-gray-600">:رقم الهاتف</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{selectedSeller.address || "غير متوفر"}</span>
                          <span className="text-gray-600">:العنوان</span>
                        </div>
                      </div>
                    </div>

                    {/* Bank Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18" />
                        </svg>
                        المعلومات البنكية
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium" dir="ltr">{selectedSeller.bank_name || "غير متوفر"}</span>
                          <span className="text-gray-600">:اسم البنك</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium" dir="ltr">{selectedSeller.account_number || "غير متوفر"}</span>
                          <span className="text-gray-600">:رقم الحساب</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        الإحصائيات
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <span className="block text-sm text-blue-600 font-medium mb-1">عدد المنتجات</span>
                          <span className="text-2xl font-bold text-blue-700" dir="ltr">{selectedSeller.total_products || 0}</span>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <span className="block text-sm text-green-600 font-medium mb-1">عدد التقييمات</span>
                          <span className="text-2xl font-bold text-green-700" dir="ltr">{selectedSeller.total_reviews || 0}</span>
                        </div>
                        <div className="border rounded-lg p-4 text-center col-span-2">
                          <span className="block text-sm text-yellow-600 font-medium mb-1">متوسط التقييم</span>
                          <div className="flex items-center justify-center gap-1 text-yellow-700">
                            <span className="text-2xl font-bold" dir="ltr">{(Number(selectedSeller.average_rating) || 0).toFixed(1)}</span>
                            <span className="text-lg">/</span>
                            <span className="text-lg">5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products Preview */}
                    {selectedSeller.products && selectedSeller.products.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="h-5 w-5 ml-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          آخر المنتجات
                        </h4>
                        <div className="border rounded-lg divide-y">
                          {selectedSeller.products.slice(0, 3).map((product) => (
                            <div key={product.product_id} className="flex items-center justify-between p-3">
                              <span className="text-green-600" dir="ltr">{product.price} ريال</span>
                              <span className="font-medium">{product.title || product.part_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
} 