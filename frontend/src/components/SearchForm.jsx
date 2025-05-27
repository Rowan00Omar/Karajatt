import { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import { Select, SelectItem } from "./Select";
import Button from "./Button";

const SearchForm = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [category, setCategory] = useState("");
  const [part, setPart] = useState("");

  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modelsByManufacturer, setModelsByManufacturer] = useState({});
  const [partsByCategory, setPartsByCategory] = useState({});
  const [yearsByModel, setYearsByModel] = useState({});

  const models = manufacturer ? modelsByManufacturer[manufacturer] || [] : [];
  const parts = category ? partsByCategory[category] || [] : [];
  const yearRange =
    manufacturer && model
      ? yearsByModel[manufacturer]?.[model]?.[0] || null
      : null;
  const availableYears = yearRange ? generateYearRange(yearRange) : [];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState({
    initialLoad: true,
    search: false,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading((prev) => ({ ...prev, initialLoad: true }));

        const response = await fetch("/api/filtering/unified-data");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data);
        setManufacturers(data.manufacturers);
        setCategories(data.categories);
        setModelsByManufacturer(data.modelsByManufacturer);
        setPartsByCategory(data.partsByCategory);
        setYearsByModel(data.yearsByModel);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading((prev) => ({ ...prev, initialLoad: false }));
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (!manufacturer) {
      setModel("");
    }
  }, [manufacturer]);

  useEffect(() => {
    if (!category) {
      setPart("");
    }
  }, [category]);

  function generateYearRange(range) {
    if (!range?.start_year) return [];
    const years = [];
    const endYear = range.end_year || range.start_year;
    for (let i = range.start_year; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  }

  const handleSearch = async () => {
    try {
      setLoading((prev) => ({ ...prev, search: true }));
      setResults([]); // Clear previous results

      // Build query parameters
      const params = new URLSearchParams();
      if (manufacturer) params.append("manufacturer", manufacturer);
      if (model) params.append("model", model);
      if (selectedYear) params.append("year", selectedYear);
      if (category) params.append("category", category);
      if (part) params.append("part", part);

      const response = await fetch(
        `/api/seller/filtered-part?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();

      // Transform the API response to match your expected format if needed
      const formattedResults = products.map((product) => ({
        id: product.product_id,
        name: product.part_name,
        price: `${product.price} ريال`,
        image: product.image_url,
        extraImages: [
          product.extra_image1,
          product.extra_image2,
          product.extra_image3,
        ].filter(Boolean), // Only include if they exist
        condition: product.condition,
        storageDuration: product.storage_duration,
        compatibleModels: `${product.start_year} إلى ${
          product.end_year || product.start_year
        }`,
        seller: "Seller Name", // You might need to join with sellers table
        rating: product.rating,
        reviews: product.review_count,
        additionalDetails: product.description,
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("Search failed:", err);
      // Optionally show error to user
      setResults([]);
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  return (
    <div dir="rtl" className="w-full pt-24 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-blue-800">
        البحث عن قطع غيار مستخدمة
      </h1>

      <div className="flex flex-row gap-4 justify-center">
        {/* Manufacturer Select */}
        <Select
          onValueChange={setManufacturer}
          value={manufacturer}
          disabled={loading.initialLoad}
          className="p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50"
        >
          <SelectItem disabled value="">
            اختر نوع السيارة
          </SelectItem>
          {manufacturers.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </Select>

        {/* Model Select (only shows if manufacturer selected) */}
        {manufacturer && (
          <Select
            onValueChange={setModel}
            value={model}
            className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
          >
            <SelectItem disabled value="">
              اختر الموديل
            </SelectItem>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </Select>
        )}

        {/* Year Select (only shows if model selected) */}
        {model && availableYears.length > 0 && (
          <Select
            onValueChange={setSelectedYear}
            value={selectedYear}
            className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue"
          >
            <SelectItem disabled value="">
              اختر السنة
            </SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </Select>
        )}

        {/* Category Select */}
        <Select
          onValueChange={setCategory}
          value={category}
          disabled={loading.initialLoad}
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

        {/* Part Select (only shows if category selected) */}
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

        {/* Condition Select */}
        <Select className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue">
          <SelectItem disabled value="">
            اختر الحالة
          </SelectItem>
          <SelectItem value="refurbished">مجددة</SelectItem>
          <SelectItem value="used">مستعملة</SelectItem>
        </Select>

        {/* Search Button */}
        <Button
          type="submit"
          onClick={handleSearch}
          disabled={loading.search}
          className="self-center"
        >
          {loading.search ? "جاري البحث..." : "بحث"}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
};

export default SearchForm;
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const manufacturersRes = await fetch("/api/filtering/manufacturers");
//       const manufacturersData = await manufacturersRes.json();
//       setManufacturers(manufacturersData);

//       const categoriesRes = await fetch("/api/filtering/categories");
//       const categoriesData = await categoriesRes.json();
//       setCategories(categoriesData);
//     } catch (err) {
//       console.error("Failed to fetch data:", err);
//     }
//   };

//   fetchData();
// }, []);
// useEffect(() => {
//   const fetchModels = async () => {
//     if (!manufacturer) {
//       setModels([]);
//       return;
//     }
//     setLoading((prev) => ({ ...prev, models: true }));
//     try {
//       const res = await fetch(
//         `/api/filtering/models?manufacturer=${encodeURIComponent(
//           manufacturer
//         )}`
//       );
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//       const data = await res.json();
//       setModels(data);
//       setModel("");
//     } catch (err) {
//       console.error("Failed to fetch models:", err);
//       setModels([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, models: false }));
//     }
//   };

//   fetchModels();
// }, [manufacturer]);
// useEffect(() => {
//   const fetchParts = async () => {
//     if (!category) {
//       setParts([]);
//       setPart("");
//       return;
//     }
//     setLoading((prev) => ({ ...prev, parts: true }));
//     try {
//       const res = await fetch(
//         `/api/filtering/parts?category=${encodeURIComponent(category)}`
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       setParts(data);
//       setPart("");
//     } catch (err) {
//       console.error("Failed to fetch parts:", err);
//       setParts([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, parts: false }));
//     }
//   };

//   fetchParts();
// }, [category]);
// useEffect(() => {
//   const fetchYears = async () => {
//     if (!manufacturer || !model) {
//       setYearRange(null);
//       setAvailableYears([]);
//       setSelectedYear("");
//       return;
//     }

//     setLoading((prev) => ({ ...prev, years: true }));

//     try {
//       const res = await fetch(
//         `/api/filtering/years?manufacturer=${encodeURIComponent(
//           manufacturer
//         )}&model=${encodeURIComponent(model)}`
//       );

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();

//       if (data.length > 0) {
//         setYearRange(data[0]);

//         const years = [];
//         for (let i = data[0].start_year; i <= data[0].end_year; i++) {
//           years.push(i);
//         }
//         setAvailableYears(years);
//       } else {
//         setYearRange(null);
//         setAvailableYears([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch years:", err);
//       setYearRange(null);
//       setAvailableYears([]);
//     } finally {
//       setLoading((prev) => ({ ...prev, years: false }));
//     }
//   };

//   fetchYears();
// }, [manufacturer, model]);
//   const [manufacturer, setManufacturer] = useState("");
// const [manufacturers, setManufacturers] = useState([]);
// const [model, setModel] = useState("");
// const [models, setModels] = useState([]);
// const [yearRange, setYearRange] = useState(null);
// const [selectedYear, setSelectedYear] = useState("");
// const [availableYears, setAvailableYears] = useState([]);
// const [yearsByModel, setYearsByModel] = useState([]);
// const [category, setCategory] = useState("");
// const [categories, setCategories] = useState([]);
// const [parts, setParts] = useState("");
// const [part, setPart] = useState("");
// const [results, setResults] = useState([]);
// const [loading, setLoading] = useState({
//   parts: false,
//   categories: false,
//   category: false,
//   models: false,
//   years: false,
// });
