import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, Package, DollarSign } from "lucide-react";
import axios from "axios";

export default function SalesPage() {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    orderGrowth: "0%",
    salesData: [],
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

      const apiUrl = `/api/admin/stats/sales`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const validSalesData = [];

        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, "0");
          const dateStr = `${selectedYear}-${monthStr}-01`; // Add day for proper date parsing

          // Find if there's data for this month
          const monthData = (response.data.salesData || []).find((item) => {
            const itemDate = new Date(item.name);
            return (
              itemDate.getMonth() === month - 1 &&
              itemDate.getFullYear() === selectedYear
            );
          });

          validSalesData.push({
            name: dateStr,
            value: monthData ? Number(monthData.value) || 0 : 0,
          });
        }

        console.log("Monthly Sales Data:", validSalesData);

        setDashboardData({
          totalOrders: response.data.totalOrders || 0,
          orderGrowth: response.data.orderGrowth || "0%",
          salesData: validSalesData,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard data. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  const totalRevenue = dashboardData.salesData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const monthsWithSales = dashboardData.salesData.filter(
    (item) => item.value > 0
  ).length;
  const averageRevenue =
    monthsWithSales > 0 ? totalRevenue / monthsWithSales : 0;

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
    <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            المبيعات والطلبات
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            تحليل أداء المبيعات والإيرادات
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
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                إجمالي الإيرادات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toLocaleString("ar-SA")} ر.س
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                إجمالي الطلبات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalOrders.toLocaleString("ar-SA")}
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
              <p className="text-sm font-medium text-gray-500">
                متوسط الإيرادات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {averageRevenue.toLocaleString("ar-SA")} ر.س
              </p>
            </div>
          </div>
        </div>
      </div>

      {dashboardData.salesData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">الإيرادات الشهرية</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("ar", { month: "short" });
                  }}
                  stroke="#6B7280"
                />
                <YAxis
                  stroke="#6B7280"
                  tickFormatter={(value) =>
                    `${value.toLocaleString("ar-SA")} ر.س`
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString("ar-SA")} ر.س`,
                    "الإيرادات",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("ar", {
                      year: "numeric",
                      month: "long",
                    });
                  }}
                  contentStyle={{ textAlign: "right", direction: "rtl" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {dashboardData.salesData.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد بيانات متاحة للفترة المحددة</p>
          </div>
        </div>
      )}
    </div>
  );
}
