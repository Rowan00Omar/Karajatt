import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, TrendingUp, Calendar, ShoppingBag } from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function InventoryPage() {
  const [dashboardData, setDashboardData] = useState({
    totalStock: 0,
    stockTrend: "0%",
    newProducts: 0,
    productsTrend: "0%",
    inventoryMovement: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const apiUrl = `/api/admin/stats/inventory`;
      console.log("API URL:", apiUrl);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Raw API Response:", response.data);
      console.log("Inventory Movement Data:", response.data.inventoryMovement);

      if (response.data) {
        // Create data for all months of the selected year
        const validInventoryData = [];
        const currentDate =
          response.data.inventoryMovement[0]?.date ||
          new Date().toISOString().slice(0, 7);

        // Generate data for all months of the selected year
        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, "0");
          const dateStr = `${selectedYear}-${monthStr}`;

          validInventoryData.push({
            name: dateStr,
            value: dateStr === currentDate ? response.data.totalStock || 0 : 0,
          });
        }

        console.log("Monthly Inventory Data:", validInventoryData);

        setDashboardData({
          totalStock: response.data.totalStock || 0,
          stockTrend: response.data.stockTrend || "0%",
          newProducts: response.data.newProducts || 0,
          productsTrend: response.data.productsTrend || "0%",
          inventoryMovement: validInventoryData,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inventory data:", err);
      if (err.response) {
        console.log("Error Response:", err.response.data);
        console.log("Error Status:", err.response.status);
      }
      setError(
        err.response?.data?.message ||
          "Failed to fetch inventory data. Please check your connection and try again."
      );
      setLoading(false);
    }
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
        <title>المخزون والمنتجات</title>
      </Helmet>
      <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              المخزون والمنتجات
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              تحليل حركة المخزون والمنتجات
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border-0 py-1 text-gray-900 focus:ring-0 text-sm"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  إجمالي المخزون
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalStock.toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  المنتجات الجديدة
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.newProducts.toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">نمو المخزون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stockTrend}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">حركة المخزون</h3>
          {dashboardData.inventoryMovement.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد بيانات متاحة للفترة المحددة</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.inventoryMovement}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorInventory"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(value) => {
                      try {
                        console.log("XAxis formatting value:", value);
                        // Handle YYYY-MM format
                        const [year, month] = value.split("-");
                        const date = new Date(year, parseInt(month) - 1);
                        if (isNaN(date.getTime())) {
                          console.log("Invalid date detected:", value);
                          return value;
                        }
                        const formatted = new Intl.DateTimeFormat("ar", {
                          month: "long",
                          calendar: "gregory",
                        }).format(date);
                        console.log("Formatted date:", formatted);
                        return formatted;
                      } catch (e) {
                        console.error("Date parsing error:", e);
                        return value;
                      }
                    }}
                    stroke="#6B7280"
                  />
                  <YAxis
                    stroke="#6B7280"
                    tickFormatter={(value) => value.toLocaleString("ar-SA")}
                  />
                  <Tooltip
                    formatter={(value) => [
                      value.toLocaleString("ar-SA"),
                      "المخزون",
                    ]}
                    labelFormatter={(label) => {
                      try {
                        const date = new Date(label);
                        if (isNaN(date.getTime())) {
                          return label;
                        }
                        return new Intl.DateTimeFormat("ar", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          calendar: "gregory",
                        }).format(date);
                      } catch (e) {
                        console.error("Date parsing error:", e);
                        return label;
                      }
                    }}
                    contentStyle={{ textAlign: "right", direction: "rtl" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fill="url(#colorInventory)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
