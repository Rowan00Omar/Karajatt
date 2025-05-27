import React, { use, useState, useEffect } from "react";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Select, SelectItem } from "../components/Select";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import axios from "axios";

const partStatus = ["مقبولة", "جيدة", "جيدة جدا", "ممتازة"];

const SellerUpload = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturer, setManufacturer] = useState("");
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [category, setCategory] = useState("");
  const [parts, setParts] = useState([]);
  const [part, setPart] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState([]);
  const [numberOfParts, setNumberOfParts] = useState("");
  const [title, setTitle] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [timeInStock, setTimeInStock] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [condition,setCondition] = useState("");
  const [loading, setLoading] = useState({
    parts: false,
    part: false,
    categories: false,
    category: false,
    model: false,
    models: false,
  });

const [id , setId] = useState(null);
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
    const fetchData = async () => {
      try {
        const manufacturersRes = await fetch("/api/filtering/manufacturers");
        const manufacturersData = await manufacturersRes.json();
        setManufacturers(manufacturersData);
        const categoriesRes = await fetch("/api/filtering/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!manufacturer) {
        setModels([]);
        return;
      }
      setLoading((prev) => ({ ...prev, models: true }));
      try {
        const res = await fetch(
          `/api/filtering/models?manufacturer=${encodeURIComponent(
            manufacturer
          )}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setModels(data);
        setModel("");
      } catch (err) {
        console.error("Failed to fetch models:", err);
        setModels([]);
      } finally {
        setLoading((prev) => ({ ...prev, models: false }));
      }
    };

    fetchModels();
  }, [manufacturer]);

  useEffect(() => {
    const fetchParts = async () => {
      if (!category) {
        setParts([]);
        setPart("");
        return;
      }
      setLoading((prev) => ({ ...prev, parts: true }));
      try {
        const res = await fetch(
          `/api/filtering/parts?category=${encodeURIComponent(category)}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setParts(data);
        setPart("");
      } catch (err) {
        console.error("Failed to fetch parts:", err);
        setParts([]);
      } finally {
        setLoading((prev) => ({ ...prev, parts: false }));
      }
    };

    fetchParts();
  }, [category]);

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
  formData.append("condition",condition)
  formData.append("id",id)
  
  
  try {
    const res = await axios.post("/api/seller/upload" ,formData , {
       headers: {
      "Content-Type": "multipart/form-data",
    }}
    )
     

    const result = res;
    alert("تم رفع القطعة بنجاح!");
    console.log(result);

    setManufacturer("");
    setModel("");
    setStartYear("");
    setEndYear("");
    setCategory("");
    setPart("");
    setImages([]);
    setStatus("");
    setNumberOfParts("");
    setTitle("");
    setExtraDetails("");
    setTimeInStock("");
    setPrice("");
     console.log({ manufacturer, model, startYear,endYear ,  category, part, images });   
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
    if (value === "" || Number(value) >= Number(endYear) || startYear === "") {
      setEndYear(value);
    }
  };
  return (
    <>
      <Navbar />
      <Card className="max-w-xl mx-auto mt-24 mb-16 ">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold">ارفع قطعة جديدة</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
          >
            <Select onValueChange={setManufacturer} value={manufacturer}>
              <SelectItem disabled value="">
                اختر الماركة
              </SelectItem>
              {manufacturers.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </Select>

            {manufacturer && (
              <Select
                onValueChange={setModel}
                value={model}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              >
                <SelectItem disabled value="">
                  اختر نوع السيارة
                </SelectItem>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </Select>
            )}
            <Input
              type="text"
              placeholder="ادخل عنوان الاعلان"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Input
              type="number"
              placeholder="ادخل السعر"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="ادخل سنة البداية"
                value={startYear}
                onChange={handleStartYearChange}
                min="1900"
                max={new Date().getFullYear()}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              />
              <Input
                type="number"
                placeholder="ادخل سنة النهاية"
                value={endYear}
                onChange={handleEndYearChange}
                min="1900"
                max={new Date().getFullYear()}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              />
            </div>
            <Select
              onValueChange={setCategory}
              value={category}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            >
              <SelectItem disabled value="">
                اختر النوع
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <Select
              onValueChange={setCondition}
              value={condition}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            >
              <SelectItem disabled value="">
                حالة الاستخدام
              </SelectItem>
              <SelectItem>مجددة</SelectItem>
              <SelectItem>مستعملة</SelectItem>
            </Select>
            {category && (
              <Select
                onValueChange={setPart}
                value={part}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              >
                <SelectItem disabled value="">
                  اختر القطعة
                </SelectItem>
                {parts.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Input
              type="number"
              placeholder="ادخل عدد القطع"
              value={numberOfParts}
              onChange={(e) => setNumberOfParts(e.target.value)}
              min="1"
              max="100"
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Select
              onValueChange={setStatus}
              value={status}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue focus:ring-1 focus:ring-babyJanaBlue"
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
            <Input
              type="number"
              placeholder="ادخل مدة تخزينه"
              value={timeInStock}
              onChange={(e) => setTimeInStock(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Input
              type="text"
              placeholder="ادخل تفاصيل اضافية"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <div className="flex items-center justify-center h-full">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-babyJanaBlue text-white text-sm font-medium rounded-md shadow hover:bg-darkerJanaBlue transition"
              >
                اختر صور المنشور
              </label>
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <Button type="submit" className="self-center">
              استمر
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
export default SellerUpload;
