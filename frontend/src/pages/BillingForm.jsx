import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowRight, X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Helmet } from "react-helmet";
import DeliveryMap from "../components/DeliveryMap";

import googleMapsConfig from "../config/googleMaps";

const BillingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [addressOption, setAddressOption] = useState("your"); // "your" or "our"
  const [mapMarker, setMapMarker] = useState(null);

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
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (addressOption === "your" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapMarker(loc);
        setFormData({ ...formData, lat: loc.lat, lng: loc.lng });
      });
    } else if (addressOption === "our") {
      const ourData = {
        street: "طريق الملك فهد الفرعي",
        building: "برج المملكة",
        apartment: "1",
        floor: "99",
        postal_code: "12214",
        city: "الرياض",
        country: "SA",
        state: "الرياض",
        lat: googleMapsConfig.ourLocation.lat,
        lng: googleMapsConfig.ourLocation.lng,
      };
      
      setFormData((prev) => ({ ...prev, ...ourData }));
      setMapMarker({ lat: ourData.lat, lng: ourData.lng });
    }
  }, [addressOption]);

  const handleMapClick = (e) => {
    if (addressOption === "your") {
      const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMapMarker(loc);
      setFormData({ ...formData, lat: loc.lat, lng: loc.lng });
    }
  };

  const updateAddressOption = (option) => {
    setAddressOption(option);

    if (option === "our") {
      // Prefill with "our location"
      setFormData((prev) => ({
        ...prev,
        street: "طريق الملك فهد الفرعي",
        building: "برج المملكة",
        apartment: "1",
        floor: "99",
        postal_code: "12214",
        city: "الرياض",
        country: "SA",
        state: "الرياض",
        lat: googleMapsConfig.ourLocation.lat,
        lng: googleMapsConfig.ourLocation.lng,
      }));
    } else if (option === "your") {
      // Clear fields or keep whatever deliveryData provides
      setFormData((prev) => ({
        ...prev,
        street: "",
        building: "",
        apartment: "",
        floor: "",
        postal_code: "",
        city: "Riyadh",
        country: "SA",
        state: "Riyadh",
        lat: "",
        lng: "",
      }));
    }
  };

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
    // Keep only digits
    let digitsOnly = value.replace(/\D/g, "");

    // Remove any accidental leading 0
    if (digitsOnly.startsWith("0")) {
      digitsOnly = digitsOnly.substring(1);
    }

    // Limit to 9 digits (Saudi format after removing 0)
    if (digitsOnly.length > 9) {
      digitsOnly = digitsOnly.substring(0, 9);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: digitsOnly,
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
      console.log("formatted data", formattedData);
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
                  {/* <Input
                    type="tel"
                    name="phone_number"
                    placeholder="رقم الهاتف"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    سيتم إضافة رمز الدولة +966 تلقائياً
                  </p> */}

                  <div className="flex items-center border rounded-lg px-3 py-2" dir="ltr">
                    <span className="text-gray-700 mr-2">+966</span>
                    <Input
                      type="tel"
                      name="phone_number"
                      placeholder="5xxxxxxxx"
                      value={formData.phone_number}
                      onChange={handleChange}
                      pattern="[5][0-9]{8}" // force 9 digits starting with 5
                      maxLength={9}
                      className="flex-1 outline-none"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    سيتم إضافة رمز الدولة +966 تلقائياً
                  </p>

                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    معلومات العنوان
                  </h3>

                  {/* Radio Selection */}
                  <div className="flex gap-8">
                    {["your", "our"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="addressOption"
                          value={opt}
                          checked={addressOption === opt}
                          onChange={() => updateAddressOption(opt)}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-gray-800">
                          {opt === "your" ? "موقعك" : "موقعنا"}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Conditional Map / Text */}
                  {addressOption === "your" ? (
                    <div className="space-y-4">
                      <Input
                        type="text"
                        name="street"
                        placeholder="الشارع"
                        value={formData.street}
                        onChange={handleChange}
                        required={!formData.street}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          name="apartment"
                          placeholder="الشقة"
                          value={formData.apartment}
                          onChange={handleChange}
                          required={!formData.apartment}
                        />
                        <Input
                          type="text"
                          name="floor"
                          placeholder="الطابق"
                          value={formData.floor}
                          onChange={handleChange}
                          required={!formData.floor}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          name="building"
                          placeholder="رقم المبنى"
                          value={formData.building}
                          onChange={handleChange}
                          required={!formData.building}
                        />
                        <Input
                          type="text"
                          name="postal_code"
                          placeholder="الرقم البريدي"
                          value={formData.postal_code}
                          onChange={handleChange}
                          required={!formData.postal_code}
                        />
                      </div>
                      <DeliveryMap
                        mode="your"
                        deliveryData={formData}
                        setDeliveryData={setFormData}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="street"
                        value="طريق الملك فهد الفرعي"
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="apartment"
                          value="برج المملكة"
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100"
                        />
                        <input
                          type="text"
                          name="floor"
                          value="1"
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100"
                        />
                        <input
                          type="text"
                          name="building"
                          value="99"
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100"
                        />
                        <input
                          type="text"
                          name="postal_code"
                          value="12214"
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100"
                        />
                      </div>

                      <DeliveryMap
                        mode="our"
                        deliveryData={formData}
                        setDeliveryData={setFormData}
                      />
                    </div>
                  )}
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
