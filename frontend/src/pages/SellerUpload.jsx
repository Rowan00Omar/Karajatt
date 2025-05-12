import React, { use, useState, useEffect } from "react";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Select, SelectItem } from "../components/Select";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
const manufacturers = ["Toyota", "Ford", "Honda"];
const models = {
  Toyota: ["Corolla", "Camry", "RAV4"],
  Ford: ["Fiesta", "Focus", "Mustang"],
  Honda: ["Civic", "Accord", "CR-V"],
};

const parts = {
  Engine: ["Alternator", "Radiator", "Spark Plug"],
  Transmission: ["Clutch", "Gearbox", "Driveshaft"],
  Suspension: ["Shock Absorber", "Strut", "Control Arm"],
  Interior: ["Dashboard", "Seat", "Steering Wheel"],
  Exterior: ["Bumper", "Mirror", "Headlight"],
};
const partStatus = ["مقبولة", "جيدة", "جيدة جدا", "ممتازة"];

const SellerUpload = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [category, setCategory] = useState("");
  const [part, setPart] = useState("");
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState([]);
  const [numberOfParts, setNumberOfParts] = useState("");
  const [title, setTitle] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [timeInStock, setTimeInStock] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("لا تستطيع رفع اكثر من 4 صور");
      return;
    }
    setImages(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ manufacturer, model, year, category, part, images });
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
                  اختر الموديل
                </SelectItem>
                {models[manufacturer].map((m) => (
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

            {category && (
              <Select
                onValueChange={setPart}
                value={part}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              >
                <SelectItem disabled value="">
                  اختر القطعة
                </SelectItem>
                {parts[category]?.map((p) => (
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
