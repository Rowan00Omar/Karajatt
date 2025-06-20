import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Select, SelectItem } from "../components/Select";
import Input from "../components/Input";
import axios from "axios";

const partStatus = ["مقبولة", "جيدة", "جيدة جدا", "ممتازة"];

const fieldNamesArabic = {
  manufacturer: "الماركة",
  model: "نوع السيارة",
  startYear: "سنة البداية",
  endYear: "سنة النهاية",
  category: "النوع",
  part: "القطعة",
  status: "الحالة",
  title: "عنوان الاعلان",
  price: "السعر",
  condition: "حالة الاستخدام",
  id: "المعرف",
};

const SellerUpload = () => {
  const [filterData, setFilterData] = useState({
    manufacturers: [],
    modelsByManufacturer: {},
    categories: [],
    partsByCategory: {},
    yearsByModel: {},
  });
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [category, setCategory] = useState("");
  const [part, setPart] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [timeInStock, setTimeInStock] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user role", err);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUnifiedData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/filtering/unified-data");
        setFilterData(res.data);
      } catch (err) {
        console.error("Failed to fetch unified data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnifiedData();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert("لا تستطيع رفع اكثر من 4 صور");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      manufacturer,
      model,
      startYear,
      endYear,
      category,
      part,
      status,
      title,
      price,
      condition,
      id,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => fieldNamesArabic[key]);

    if (missingFields.length > 0) {
      setError(`الحقول التالية مطلوبة: ${missingFields.join("، ")}`);
      return;
    }

    if (Number(startYear) > Number(endYear)) {
      setError("سنة البداية يجب أن تكون أقل من أو تساوي سنة النهاية");
      return;
    }

    if (images.length === 0) {
      setError("يرجى اختيار صورة واحدة على الأقل");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("manufacturer", manufacturer);
      formData.append("model", model);
      formData.append("startYear", startYear);
      formData.append("endYear", endYear);
      formData.append("category", category);
      formData.append("part", part);
      formData.append("status", status);
      formData.append("title", title);
      formData.append("extraDetails", extraDetails);
      formData.append("timeInStock", timeInStock);
      formData.append("price", price);
      formData.append("condition", condition);
      formData.append("id", id);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("يرجى تسجيل الدخول أولاً");
        return;
      }

      const res = await axios.post("/api/seller/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setImages(res.data.images);
        setMessage("تم رفع المنتج بنجاح!");
        setError("");
        resetForm();
      }
    } catch (err) {
      console.error("فشل في رفع المنتج:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("تفاصيل خطأ الخادم:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });

        setError(
          `خطأ في الخادم: ${
            err.response.data?.message ||
            err.response.data?.error ||
            "حدث خطأ أثناء رفع القطعة"
          }`
        );
      } else if (err.request) {
        // The request was made but no response was received
        console.error("لم يتم استلام رد من الخادم:", err.request);
        setError("لم يتم استلام رد من الخادم. يرجى التحقق من اتصالك بالإنترنت");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("خطأ في إعداد الطلب:", err.message);
        setError("حدث خطأ أثناء إعداد الطلب");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartYearChange = (e) => {
    const value = e.target.value;
    setStartYear(value);
  };

  const handleEndYearChange = (e) => {
    const value = e.target.value;
    setEndYear(value);
  };

  const getModels = () => {
    return manufacturer
      ? filterData.modelsByManufacturer[manufacturer] || []
      : [];
  };

  const getParts = () => {
    return category ? filterData.partsByCategory[category] || [] : [];
  };

  const resetForm = () => {
    setManufacturer("");
    setModel("");
    setStartYear("");
    setEndYear("");
    setCategory("");
    setPart("");
    setImages([]);
    setStatus("");
    setTitle("");
    setExtraDetails("");
    setTimeInStock("");
    setPrice("");
    setCondition("");
  };

  return (
    <div className="min-h-[90%] bg-gray-50 py-0 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-7xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardContent className="space-y-6 p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">رفع قطعة جديدة</h2>
            <p className="text-gray-600">
              قم بملء التفاصيل التالية لرفع قطعة جديدة
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Information Section */}
              <div className="space-y-4 md:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  المعلومات الأساسية
                </h3>
                <Input
                  type="text"
                  placeholder="ادخل عنوان الاعلان"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Vehicle Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  معلومات السيارة
                </h3>
                <Select
                  onValueChange={setManufacturer}
                  value={manufacturer}
                  className="w-full transition-all duration-200 hover:border-blue-400"
                >
                  <SelectItem disabled value="">
                    اختر الماركة
                  </SelectItem>
                  {filterData.manufacturers.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </Select>

                {manufacturer ? (
                  <Select
                    onValueChange={setModel}
                    value={model}
                    className="w-full transition-all duration-200 hover:border-blue-400"
                  >
                    <SelectItem disabled value="">
                      اختر نوع السيارة
                    </SelectItem>
                    {getModels().map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div className="w-full h-[40px] border border-gray-200 rounded-md bg-gray-50 opacity-50" />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="سنة البداية"
                    value={startYear}
                    onChange={handleStartYearChange}
                    className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                  <Input
                    type="number"
                    placeholder="سنة النهاية"
                    value={endYear}
                    onChange={handleEndYearChange}
                    className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Part Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  معلومات القطعة
                </h3>
                <Select
                  onValueChange={setCategory}
                  value={category}
                  className="w-full transition-all duration-200 hover:border-blue-400"
                >
                  <SelectItem disabled value="">
                    اختر النوع
                  </SelectItem>
                  {filterData.categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </Select>

                {category && (
                  <Select
                    onValueChange={setPart}
                    value={part}
                    className="w-full transition-all duration-200 hover:border-blue-400"
                  >
                    <SelectItem disabled value="">
                      اختر القطعة
                    </SelectItem>
                    {getParts().map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Select
                  onValueChange={setCondition}
                  value={condition}
                  className="w-full transition-all duration-200 hover:border-blue-400"
                >
                  <SelectItem disabled value="">
                    حالة الاستخدام
                  </SelectItem>
                  <SelectItem value="مجددة">مجددة</SelectItem>
                  <SelectItem value="مستعملة">مستعملة</SelectItem>
                </Select>

                <Select
                  onValueChange={setStatus}
                  value={status}
                  className="w-full transition-all duration-200 hover:border-blue-400"
                >
                  <SelectItem disabled value="">
                    اختر الحالة
                  </SelectItem>
                  {partStatus.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Price and Stock Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  السعر والمخزون
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="ادخل السعر"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                  <Input
                    type="number"
                    placeholder="مدة التخزين"
                    value={timeInStock}
                    onChange={(e) => setTimeInStock(e.target.value)}
                    className="w-full transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <textarea
                  placeholder="تفاصيل إضافية"
                  value={extraDetails}
                  onChange={(e) => setExtraDetails(e.target.value)}
                  className="w-full p-3 border rounded-md transition-all duration-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[80px]"
                />
              </div>

              {/* Images Section */}
              <div className="space-y-4 md:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  الصور
                </h3>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-4 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50 transition-all duration-200">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">
                      اختر الصور
                    </span>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`img-${idx}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-0">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-0 text-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    جارٍ الرفع...
                  </div>
                ) : (
                  "رفع القطعة"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerUpload;
