import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowRight, X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Helmet } from "react-helmet";

const BillingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    apartment: "",
    floor: "",
    street: "",
    building: "",
    shipping_method: "PKG",
    postal_code: "",
    city: "Riyadh",
    country: "SA",
    state: "Riyadh",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setFormData((prev) => ({
          ...prev,
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
        }));
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      let formattedNumber = value.replace(/\D/g, "");

      if (!formattedNumber.startsWith("966")) {
        if (formattedNumber.startsWith("0")) {
          formattedNumber = formattedNumber.substring(1);
        }

        if (!formattedNumber.startsWith("966")) {
          formattedNumber = "+966" + formattedNumber;
        }
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedNumber,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      let cartData = location.state?.cartData;

      if (!cartData) {
        const saved = localStorage.getItem("checkoutCartData");
        if (saved) {
          cartData = JSON.parse(saved);
        }
      }

      if (!cartData) {
        throw new Error("لم يتم العثور على بيانات السلة");
      }

      const formattedData = {
        ...formData,
        phone_number: formData.phone_number.startsWith("+966")
          ? formData.phone_number
          : "+966" + formData.phone_number,
      };

      const response = await axios.post(
        "/api/payments/checkout",
        {
          ...cartData,
          billingData: formattedData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.paymentUrl) {
        localStorage.setItem("currentOrderId", response.data.orderId);
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.data.error || "فشل في بدء عملية الدفع");
      }
    } catch (err) {
      console.error("خطأ في الدفع:", {
        error: err.response?.data?.error || err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.response?.data?.error || err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>الفاتورة</title>
      </Helmet>
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900/30 backdrop-blur-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl relative">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  معلومات الفواتير
                </h2>
                <p className="text-gray-600">
                  يرجى إدخال معلومات الفواتير الخاصة بك للمتابعة
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    المعلومات الشخصية
                  </h3>
                  <Input
                    type="text"
                    name="first_name"
                    placeholder="الاسم الأول"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    name="last_name"
                    placeholder="الاسم الأخير"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="tel"
                    name="phone_number"
                    placeholder="رقم الهاتف"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    سيتم إضافة رمز الدولة +966 تلقائياً
                  </p>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    معلومات العنوان
                  </h3>
                  <Input
                    type="text"
                    name="street"
                    placeholder="الشارع"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    name="building"
                    placeholder="رقم المبنى"
                    value={formData.building}
                    onChange={handleChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="apartment"
                      placeholder="الشقة"
                      value={formData.apartment}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="text"
                      name="floor"
                      placeholder="الطابق"
                      value={formData.floor}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    type="text"
                    name="postal_code"
                    placeholder="الرمز البريدي"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={loading}
              >
                {loading ? "جاري المعالجة..." : "المتابعة إلى الدفع"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingForm;
