import { useEffect, useState } from 'react';
import axios from "axios";
import { Check, X, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/admin/pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data.requests || []);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError(err.response?.data?.message || "Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/approve-request/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the approved request from the list
      setRequests(requests.filter(req => req.product_id !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (productId) => {
    if (!confirm("هل أنت متأكد من رفض هذا الطلب؟")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/reject-request/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the rejected request from the list
      setRequests(requests.filter(req => req.product_id !== productId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
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

  if (!requests.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600">لا توجد طلبات معلقة</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>الطلبات المعلقة</title>
      </Helmet>
      <section className="w-full animate-fadeIn">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">الطلبات المعلقة</h2>
        
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.product_id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {request.title || request.part_name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    البائع: {request.seller_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedRequest(expandedRequest === request.product_id ? null : request.product_id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {expandedRequest === request.product_id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleApprove(request.product_id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="قبول"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleReject(request.product_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="رفض"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {expandedRequest === request.product_id && (
                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">الشركة المصنعة</p>
                      <p>{request.company_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">الموديل</p>
                      <p>{request.car_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">سنة البداية</p>
                      <p>{request.start_year}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">سنة النهاية</p>
                      <p>{request.end_year}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">السعر</p>
                      <p>{request.price} ر.س</p>
                    </div>
                    <div>
                      <p className="text-gray-500">الحالة</p>
                      <p>{request.condition}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">الوصف</p>
                    <p className="text-sm">{request.description}</p>
                  </div>

                  {request.image_url && (
                    <div>
                      <p className="text-gray-500 mb-2">الصور</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <img
                          src={request.image_url}
                          alt="صورة القطعة"
                          className="rounded-lg w-full h-24 object-cover"
                        />
                        {request.extra_image1 && (
                          <img
                            src={request.extra_image1}
                            alt="صورة إضافية 1"
                            className="rounded-lg w-full h-24 object-cover"
                          />
                        )}
                        {request.extra_image2 && (
                          <img
                            src={request.extra_image2}
                            alt="صورة إضافية 2"
                            className="rounded-lg w-full h-24 object-cover"
                          />
                        )}
                        {request.extra_image3 && (
                          <img
                            src={request.extra_image3}
                            alt="صورة إضافية 3"
                            className="rounded-lg w-full h-24 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
} 