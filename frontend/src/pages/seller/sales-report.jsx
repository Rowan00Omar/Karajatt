import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Helmet } from "react-helmet";

export default function SalesReportPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    fetchSalesReport();
    fetchBestSelling();
  }, [selectedYear]);

  const fetchSalesReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/seller/sales-report/${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalesData(response.data.sales || []);
    } catch (err) {
      console.error('Error fetching sales report:', err);
      setError(err.response?.data?.message || 'Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSelling = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/seller/best-selling', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBestSelling(response.data.products || []);
    } catch (err) {
      console.error('Error fetching best selling products:', err);
    }
  };

  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

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

  const totalRevenue = salesData.reduce((sum, month) => sum + month.revenue, 0);
  const totalSales = salesData.reduce((sum, month) => sum + month.total_sales, 0);
  const averageRevenue = totalRevenue / salesData.filter(month => month.revenue > 0).length || 0;

  return (
    <>
      <Helmet>
        <title>تقرير المبيعات (بائع)</title>
      </Helmet>
      <div className="animate-fadeIn p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">تقرير المبيعات</h2>
            <p className="mt-1 text-sm text-gray-500">تحليل أداء المبيعات والإيرادات</p>
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
                <p className="text-sm font-medium text-gray-500">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-gray-900">{totalSales.toLocaleString()} قطعة</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">متوسط الإيرادات الشهرية</p>
                <p className="text-2xl font-bold text-gray-900">{averageRevenue.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-6">الإيرادات الشهرية</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const monthIndex = value - 1;
                      return monthIndex >= 0 && monthIndex < arabicMonths.length 
                        ? arabicMonths[monthIndex] 
                        : String(value);
                    }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => `${value.toLocaleString()} ر.س`}
                  />
                  <Tooltip 
                    formatter={(value) => {
                      console.log('Tooltip value:', value);
                      return [`${value.toLocaleString()} ر.س`, 'الإيرادات'];
                    }}
                    labelFormatter={(label) => {
                      const monthIndex = label - 1;
                      return monthIndex >= 0 && monthIndex < arabicMonths.length 
                        ? arabicMonths[monthIndex] 
                        : String(label);
                    }}
                    contentStyle={{ textAlign: 'right', direction: 'rtl' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ fill: '#4F46E5', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-6">المبيعات الشهرية</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const monthIndex = value - 1;
                      return monthIndex >= 0 && monthIndex < arabicMonths.length 
                        ? arabicMonths[monthIndex] 
                        : String(value);
                    }}
                    stroke="#6B7280"
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => `${value} قطعة`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} قطعة`, 'المبيعات']}
                    labelFormatter={(label) => {
                      const monthIndex = label - 1;
                      return monthIndex >= 0 && monthIndex < arabicMonths.length 
                        ? arabicMonths[monthIndex] 
                        : String(label);
                    }}
                    contentStyle={{ textAlign: 'right', direction: 'rtl' }}
                  />
                  <Bar 
                    dataKey="total_sales" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 