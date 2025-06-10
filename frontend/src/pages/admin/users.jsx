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
import { Users, UserCheck, Search, Calendar } from "lucide-react";
import axios from "axios";

export default function UsersPage() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    userGrowth: "0%",
    activeGrowth: "0%",
    registrationData: [],
    searchData: [],
    visitData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const apiUrl = `/api/admin/stats/users?year=${selectedYear}`;
      console.log("Fetching data for year:", selectedYear);
      console.log("API URL:", apiUrl);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);

      if (response.data) {
        const validRegistrationData = [];
        const validVisitData = [];

        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, "0");
          const dateStr = `${selectedYear}-${monthStr}-01`;

          const monthRegistrationData = (
            response.data.registrationData || []
          ).find((item) => {
            const itemDate = new Date(item.name);
            return (
              itemDate.getMonth() === month - 1 &&
              itemDate.getFullYear() === selectedYear
            );
          });

          const monthVisitData = (response.data.visitData || []).find(
            (item) => {
              const itemDate = new Date(item.name);
              return (
                itemDate.getMonth() === month - 1 &&
                itemDate.getFullYear() === selectedYear
              );
            }
          );

          validRegistrationData.push({
            name: dateStr,
            value: monthRegistrationData
              ? Number(monthRegistrationData.value) || 0
              : 0,
          });

          validVisitData.push({
            name: dateStr,
            value: monthVisitData ? Number(monthVisitData.value) || 0 : 0,
          });
        }

        setDashboardData({
          totalUsers: response.data.totalUsers || 0,
          activeUsers: response.data.activeUsers || 0,
          userGrowth: response.data.userGrowth || "0%",
          activeGrowth: response.data.activeGrowth || "0%",
          registrationData: validRegistrationData,
          visitData: validVisitData,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response) {
        console.log("Error Response:", err.response.data);
        console.log("Error Status:", err.response.status);
      }
      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard data. Please check your connection and try again."
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
    <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            المستخدمون والسلوك
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            تحليل نشاط وسلوك المستخدمين
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
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                إجمالي المستخدمين
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.totalUsers.toLocaleString("ar-SA")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                المستخدمين النشطين
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.activeUsers.toLocaleString("ar-SA")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Search className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                نمو المستخدمين
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.userGrowth}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">التسجيلات الجديدة</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.registrationData}>
                <defs>
                  <linearGradient
                    id="colorRegistrations"
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
                      const date = new Date(value);
                      if (isNaN(date.getTime())) {
                        return value;
                      }
                      return new Intl.DateTimeFormat("ar", {
                        month: "long",
                        calendar: "gregory",
                      }).format(date);
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
                    "التسجيلات",
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
                  fill="url(#colorRegistrations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">الزيارات الشهرية</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.visitData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => {
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) {
                        return value;
                      }
                      return new Intl.DateTimeFormat("ar", {
                        month: "long",
                        calendar: "gregory",
                      }).format(date);
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
                    "الزيارات",
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
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
