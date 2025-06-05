import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesReportPage() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalesReport();
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

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">تقرير المبيعات الشهري</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-lg"
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

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">إجمالي الإيرادات</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalRevenue} ر.س</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">إجمالي المبيعات</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalSales} قطعة</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-6">رسم بياني للمبيعات</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => arabicMonths[value - 1]}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  name === 'revenue' ? 'الإيرادات' : 'المبيعات'
                ]}
                labelFormatter={(label) => arabicMonths[label - 1]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                name="الإيرادات"
              />
              <Line 
                type="monotone" 
                dataKey="total_sales" 
                stroke="#10B981" 
                name="المبيعات"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">تفاصيل المبيعات الشهرية</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الشهر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المبيعات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإيرادات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesData.map((month) => (
                <tr key={month.month}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {arabicMonths[month.month - 1]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {month.total_sales} قطعة
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {month.revenue} ر.س
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 