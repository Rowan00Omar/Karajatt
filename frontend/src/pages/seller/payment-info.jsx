import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentInfoPage() {
  const [paymentInfo, setPaymentInfo] = useState({
    bank_name: '',
    account_holder: '',
    account_number: '',
    iban: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/seller/payment-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentInfo(response.data.payment_info || {});
    } catch (err) {
      console.error('Error fetching payment info:', err);
      setError(err.response?.data?.message || 'Failed to fetch payment information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/seller/payment-info', paymentInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving payment info:', err);
      setError(err.response?.data?.message || 'Failed to save payment information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        <h2 className="text-2xl font-bold">معلومات البنك/الدفع</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            تعديل
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم البنك
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="bank_name"
                  value={paymentInfo.bank_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              ) : (
                <p className="text-gray-900">{paymentInfo.bank_name || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم صاحب الحساب
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="account_holder"
                  value={paymentInfo.account_holder}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              ) : (
                <p className="text-gray-900">{paymentInfo.account_holder || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الحساب
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="account_number"
                  value={paymentInfo.account_number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              ) : (
                <p className="text-gray-900">{paymentInfo.account_number || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الآيبان
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="iban"
                  value={paymentInfo.iban}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              ) : (
                <p className="text-gray-900">{paymentInfo.iban || '-'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 