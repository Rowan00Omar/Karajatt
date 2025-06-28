import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { X, Star } from "lucide-react";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const {
    cartItems,
    removeFromCart,
    subtotal,
    cartTotal,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [inspectionFee, setInspectionFee] = useState(49);
  const [feeError, setFeeError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInspectionFee = async () => {
      try {
        const response = await axios.get("/api/inspection/fee");
        if (response.data && response.data.fee !== undefined) {
          setInspectionFee(response.data.fee);
        }
      } catch (error) {
        console.error("Error fetching inspection fee:", error);
        setInspectionFee(49);
        setFeeError(null);
      }
    };

    fetchInspectionFee();
  }, []);

  const totalInspectionFees = cartItems.length * inspectionFee;
  const finalTotal = cartTotal + totalInspectionFees;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      // Get user token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("يرجى تسجيل الدخول للمتابعة");
      }

      // Format items for PayMob
      const formattedItems = cartItems.map((item) => ({
        name: item.title || item.part_name || "Product",
        amount_cents: Math.round(parseFloat(item.price) * 100),
        description:
          item.description ||
          item.title ||
          item.part_name ||
          "Product Description",
        quantity: item.quantity || 1,
      }));

      // Navigate to billing form with cart data
      navigate("/billing", {
        state: {
          cartData: {
            cartItems: formattedItems,
            amount: finalTotal,
            inspectionFees: totalInspectionFees,
            appliedCoupon: appliedCoupon
              ? {
                  code: appliedCoupon.code,
                  discount: discount,
                }
              : null,
          },
        },
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setPaymentError(
          "لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى."
        );
      } else {
        setPaymentError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "فشلت عملية الدفع. يرجى المحاولة مرة أخرى."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const result = await applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.error);
    } else {
      setCouponError("");
      setCouponCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pointer-events-none">
      <div
        className={`bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 pointer-events-auto relative flex flex-col
          ${cartItems.length > 0 ? "w-96 h-[85vh]" : "w-80 h-72"}`}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-babyJanaBlue">سلة التسوق</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">سلة التسوق فارغة</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-4 flex gap-4 items-center relative group"
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.title || item.part_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-babyJanaBlue truncate">
                      {item.title || item.part_name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {(parseFloat(item.price) || 0).toFixed(2)} ر.س
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      رسوم الفحص: {inspectionFee} ر.س
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 left-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer - Only visible when items exist */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-6 space-y-6">
            {/* Coupon Section */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="أدخل رمز الكوبون"
                  className="flex-1 border rounded-lg p-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  تطبيق
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg text-sm">
                  <span className="text-green-700">
                    تم تطبيق الكوبون: {appliedCoupon.code}
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    إزالة
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الفرعي:</span>
                <span>{subtotal.toFixed(2)} ر.س</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم:</span>
                  <span>- {discount.toFixed(2)} ر.س</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>رسوم الفحص:</span>
                <span>{totalInspectionFees.toFixed(2)} ر.س</span>
              </div>
              {feeError && (
                <p className="text-red-500 text-xs text-right">{feeError}</p>
              )}
              <div className="flex justify-between font-bold text-lg text-babyJanaBlue pt-2 border-t">
                <span>المجموع:</span>
                <span>{finalTotal.toFixed(2)} ر.س</span>
              </div>
            </div>

            {paymentError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {paymentError}
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "جاري المعالجة..." : "اتمام الشراء"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
