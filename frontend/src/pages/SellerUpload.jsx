import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Select, SelectItem } from "../components/Select";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import axios from "axios";

const partStatus = ["مقبولة", "جيدة", "جيدة جدا", "ممتازة"];

const SellerUpload = () => {
  const [filterData, setFilterData] = useState({
    manufacturers: [],
    modelsByManufacturer: {},
    categories: [],
    partsByCategory: {},
    yearsByModel: {}
  });
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [category, setCategory] = useState("");
  const [part, setPart] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("");
  const [numberOfParts, setNumberOfParts] = useState("");
  const [title, setTitle] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [timeInStock, setTimeInStock] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (files.length > 4) {
      alert("لا تستطيع رفع اكثر من 4 صور");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("manufacturer", manufacturer);
    formData.append("model", model);
    formData.append("startYear", startYear);
    formData.append("endYear", endYear);
    formData.append("category", category);
    formData.append("part", part);
    formData.append("status", status);
    formData.append("numberOfParts", numberOfParts);
    formData.append("title", title);
    formData.append("extraDetails", extraDetails);
    formData.append("timeInStock", timeInStock);
    formData.append("price", price);
    formData.append("condition", condition);
    formData.append("id", id);
    for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
    }
    try {
      const res = await axios.post("/api/seller/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (images.length === 0) {
  alert("يجب رفع صورة واحدة على الأقل.");
  return;
}
      alert("تم رفع القطعة بنجاح!");
      console.log(res);

      // Reset form
      setManufacturer("");
      setModel("");
      setStartYear("");
      setEndYear("");
      setCategory("");
      setPart("");
      setImages([]);
if (res.data.images && res.data.images.length > 0) {
  alert(`تم رفع ${res.data.images.length} صورة بنجاح!`);
  console.log("روابط الصور:", res.data.images);
}
      setStatus("");
      setNumberOfParts("");
      setTitle("");
      setExtraDetails("");
      setTimeInStock("");
      setPrice("");
      setCondition("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("حدث خطأ أثناء رفع القطعة");
    }
  };

  const handleStartYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) <= Number(endYear) || endYear === "") {
      setStartYear(value);
    }
  };

  const handleEndYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= Number(startYear) || startYear === "") {
      setEndYear(value);
    }
  };

  const getModels = () => {
    return manufacturer ? filterData.modelsByManufacturer[manufacturer] || [] : [];
  };

  const getParts = () => {
    return category ? filterData.partsByCategory[category] || [] : [];
  };

  return (
    <>
      <Navbar />
      <Card className="max-w-xl mx-auto mt-24 mb-16">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold">ارفع قطعة جديدة</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col text-babyJanaBlue"
          >
            <Select onValueChange={setManufacturer} value={manufacturer}>
              <SelectItem disabled value="">
                اختر الماركة
              </SelectItem>
              {filterData.manufacturers.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </Select>

            {manufacturer && (
              <Select onValueChange={setModel} value={model}>
                <SelectItem disabled value="">
                  اختر نوع السيارة
                </SelectItem>
                {getModels().map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Input type="text" placeholder="ادخل عنوان الاعلان" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" placeholder="ادخل السعر" value={price} onChange={(e) => setPrice(e.target.value)} />

            <div className="flex gap-4">
              <Input type="number" placeholder="ادخل سنة البداية" value={startYear} onChange={handleStartYearChange} />
              <Input type="number" placeholder="ادخل سنة النهاية" value={endYear} onChange={handleEndYearChange} />
            </div>

            <Select onValueChange={setCategory} value={category}>
              <SelectItem disabled value="">
                اختر النوع
              </SelectItem>
              {filterData.categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>

            <Select onValueChange={setCondition} value={condition}>
              <SelectItem disabled value="">
                حالة الاستخدام
              </SelectItem>
              <SelectItem>مجددة</SelectItem>
              <SelectItem>مستعملة</SelectItem>
            </Select>

            {category && (
              <Select onValueChange={setPart} value={part}>
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

            <Input type="number" placeholder="ادخل عدد القطع" value={numberOfParts} onChange={(e) => setNumberOfParts(e.target.value)} />
            <Select onValueChange={setStatus} value={status}>
              <SelectItem disabled value="">
                اختر الحالة
              </SelectItem>
              {partStatus.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>

            <Input type="number" placeholder="ادخل مدة التخزين" value={timeInStock} onChange={(e) => setTimeInStock(e.target.value)} />
            <Input type="text" placeholder="تفاصيل إضافية" value={extraDetails} onChange={(e) => setExtraDetails(e.target.value)} />

            <div className="flex flex-col">
              <label className="text-sm mb-1">اختر حتى ٤ صور</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="border p-2 rounded-md"
              />
              {images.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 overflow-hidden border">
                      <img src={URL.createObjectURL(img)} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "جارٍ الرفع..." : "رفع القطعة"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default SellerUpload;
