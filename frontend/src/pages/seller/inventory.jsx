import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchInventory();
  }, [sortBy, sortOrder]);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/seller/inventory?sort=${sortBy}&order=${sortOrder}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(response.data.products || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/seller/inventory/${productId}`, 
        { stock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setInventory(inventory.map(item => 
        item.product_id === productId 
          ? { ...item, stock: newStock }
          : item
      ));
    } catch (err) {
      console.error('Error updating stock:', err);
      alert(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.part_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">المخزون</h2>
        <a
          href="/seller/upload"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          إضافة قطعة جديدة
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="البحث في المخزون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="created_at">تاريخ الإضافة</option>
            <option value="stock">المخزون</option>
            <option value="price">السعر</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">القطعة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">السيارة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">السعر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المخزون</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">تحديث المخزون</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.product_id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.part_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p>{item.company_name}</p>
                      <p className="text-sm text-gray-500">{item.car_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.price} ر.س</td>
                  <td className="px-6 py-4">
                    <span className={`${
                      item.stock < 5 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.approval_status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : item.approval_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.approval_status === 'approved' ? 'معتمد' :
                       item.approval_status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={item.stock}
                      onChange={(e) => handleUpdateStock(item.product_id, parseInt(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            لا توجد نتائج
          </div>
        )}
      </div>
    </div>
  );
} 