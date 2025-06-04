import { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import { Select, SelectItem } from "./Select";
import Button from "./Button";
import axios from "axios";

const SearchForm = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [category, setCategory] = useState("");
  const [part, setPart] = useState("");
  const [condition, setCondition] = useState("");

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/filtering/unified-data");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setManufacturers(data.manufacturers);
        setCategories(data.categories);
        setModelsByManufacturer(data.modelsByManufacturer);
        setPartsByCategory(data.partsByCategory);
        setYearsByModel(data.yearsByModel);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
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

  const buildSearchUrl = () => {
    const params = new URLSearchParams();

    if (manufacturer) params.append("manufacturer", manufacturer);
    if (model) params.append("model", model);
    if (selectedYear) params.append("year", selectedYear);
    if (category) params.append("category", category);
    if (part) params.append("part", part);
    if (condition) params.append("condition", condition);

    return `/api/seller/filtered-part?${params.toString()}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = buildSearchUrl();
      const response = await axios.get(url);
      const products = response.data;

      if (!products || products.length === 0) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      const formattedResults = products.map((product) => ({
        id: product.product_id,
        title: product.title || product.part_name,
        price: product.price,
        condition: product.condition,
        images: product.image_url ? [product.image_url] : [],
        manufacturer: product.manufacturer,
        model: product.model,
        year_from: product.start_year,
        year_to: product.end_year,
      }));

      setResults(formattedResults);
      setTotalResults(formattedResults.length);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في البحث");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  return (
    <div
      dir="rtl"
      className="w-full pt-16 pb-12 space-y-8 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          البحث عن قطع غيار مستخدمة
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Manufacturer Select */}
            <div className="w-48">
              <Select
                onValueChange={setManufacturer}
                value={manufacturer}
                disabled={loading}
                className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
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
            </div>

            {/* Model Select (only shows if manufacturer selected) */}
            {manufacturer && (
              <div className="w-48">
                <Select
                  onValueChange={setModel}
                  value={model}
                  className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
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
              </div>
            )}

            {/* Year Select (only shows if model selected) */}
            {model && availableYears.length > 0 && (
              <div className="w-48">
                <Select
                  onValueChange={setSelectedYear}
                  value={selectedYear}
                  className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
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
              </div>
            )}

            {/* Category Select */}
            <div className="w-48">
              <Select
                onValueChange={setCategory}
                value={category}
                disabled={loading}
                className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
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
            </div>

            {/* Part Select (only shows if category selected) */}
            {category && (
              <div className="w-48">
                <Select
                  onValueChange={setPart}
                  value={part}
                  className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
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
              </div>
            )}

            {/* Condition Select */}
            <div className="w-48">
              <Select
                onValueChange={setCondition}
                value={condition}
                className="w-full p-2 px-4 rounded-lg border text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue transition-all hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
              >
                <SelectItem disabled value="">
                  حالة الاستخدام
                </SelectItem>
                <SelectItem value="مجددة">مجددة</SelectItem>
                <SelectItem value="مستعملة">مستعملة</SelectItem>
              </Select>
            </div>

            {/* Search Button */}
            <div className="w-48 flex items-center">
              <Button
                type="button"
                onClick={handleSearchClick}
                disabled={loading}
                className="w-full py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    جاري البحث...
                  </span>
                ) : (
                  "بحث"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          !loading &&
          results !== null && (
            <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-xl font-semibold text-gray-900">
                لم يتم العثور على أي منتجات
              </p>
              <p className="mt-2 text-sm text-gray-600">
                يرجى تعديل معايير البحث والمحاولة مرة أخرى
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchForm;
