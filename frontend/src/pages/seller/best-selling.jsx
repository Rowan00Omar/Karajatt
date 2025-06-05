import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BestSellingPage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/seller/best-selling', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBestSellers(response.data.products || []);
    } catch (err) {
      console.error('Error fetching best sellers:', err);
      setError(err.response?.data?.message || 'Failed to fetch best-selling parts');
    } finally {
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
      <div className="text-red-600 text-center">
        <p className="text-xl font-semibold mb-2">خطأ</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">القطع الأكثر مبيعاً</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bestSellers.map((product) => (
          <div
            key={product.product_id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
          >
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={product.image_url}
                alt={product.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>المبيعات: {product.total_sales}</span>
              <span>الإيرادات: {product.revenue} ر.س</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              المتبقي في المخزون: {product.stock}
            </div>
          </div>
        ))}
      </div>

      {bestSellers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          لا توجد بيانات مبيعات حتى الآن
        </div>
      )}
    </div>
  );
} 