import React, { use, useState } from "react";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Select, SelectItem } from "../components/Select";
import Input from "../components/Input";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const manufacturers = ["Toyota", "Ford", "Honda"];
const models = {
  Toyota: ["Corolla", "Camry", "RAV4"],
  Ford: ["Fiesta", "Focus", "Mustang"],
  Honda: ["Civic", "Accord", "CR-V"],
};
const categories = [
  "Engine",
  "Transmission",
  "Suspension",
  "Interior",
  "Exterior",
];
const parts = {
  Engine: ["Alternator", "Radiator", "Spark Plug"],
  Transmission: ["Clutch", "Gearbox", "Driveshaft"],
  Suspension: ["Shock Absorber", "Strut", "Control Arm"],
  Interior: ["Dashboard", "Seat", "Steering Wheel"],
  Exterior: ["Bumper", "Mirror", "Headlight"],
};
const partStatus = ["Acceptable", "Good", "Very good", "Excellent"];

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
  const [partName, setPartName] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [timeInStock, setTimeInStock] = useState("");
  const [price, setPrice] = useState("");
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("You can upload up to 4 images only.");
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
      <Card className="max-w-xl mx-auto mt-24 mb-16">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold">Upload New Car Part</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
          >
            <Select onValueChange={setManufacturer} value={manufacturer}>
              <SelectItem disabled value="">
                Select Manufacturer
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
                  Select Model
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
              placeholder="Enter the Title"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Input
              type="number"
              placeholder="Enter your Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Enter Start Year (e.g. 2020)"
                value={startYear}
                onChange={handleStartYearChange}
                min="1900"
                max={new Date().getFullYear()}
                className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
              />
              <Input
                type="number"
                placeholder="Enter End Year (e.g. 2020)"
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
                Select Category
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
                  Select Part
                </SelectItem>
                {parts[category].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </Select>
            )}

            <Input
              type="number"
              placeholder="Number of Parts"
              value={numberOfParts}
              onChange={(e) => setNumberOfParts(e.target.value)}
              min="1"
              max="100"
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Select
              onValueChange={setStatus}
              value={status}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            >
              <SelectItem disabled value="">
                Select Status
              </SelectItem>
              {partStatus.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Enter Time in Stock"
              value={timeInStock}
              onChange={(e) => setTimeInStock(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Input
              type="text"
              placeholder="Enter Extra Details"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
            />
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />

            <Button type="submit" className="self-center">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
export default SellerUpload;
