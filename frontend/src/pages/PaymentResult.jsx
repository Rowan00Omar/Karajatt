import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const success = searchParams.get("success") === "true";
        const orderId = searchParams.get("order_id");

        if (success && orderId) {
          // Verify payment status with backend
          const response = await axios.get(`/api/payments/verify/${orderId}`);
          if (response.data.success) {
            setStatus("success");
            setOrderDetails(response.data.order);
          } else {
            setStatus("failed");
          }
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    navigate(`/orders/${orderDetails?.id}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babyJanaBlue mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحقق من حالة الدفع...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              تم الدفع بنجاح!
            </h2>
            <p className="mt-2 text-gray-600">
              شكراً لك على طلبك. تم استلام طلبك وسيتم معالجته قريباً.
            </p>
            {orderDetails && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4 text-right">
                <p className="text-gray-700">رقم الطلب: {orderDetails.id}</p>
                <p className="text-gray-700">
                  المبلغ الإجمالي: {orderDetails.total} ر.س
                </p>
              </div>
            )}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleViewOrder}
                className="w-full bg-babyJanaBlue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                عرض تفاصيل الطلب
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              فشلت عملية الدفع
            </h2>
            <p className="mt-2 text-gray-600">
              عذراً، حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.
            </p>
            <div className="mt-8">
              <button
                onClick={handleContinueShopping}
                className="w-full bg-babyJanaBlue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                العودة للتسوق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
