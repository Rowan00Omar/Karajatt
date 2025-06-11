import { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import { Select, SelectItem } from "./Select";
import Button from "./Button";
import axios from "axios";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Car,
  Wrench,
  Calendar,
  Tag,
} from "lucide-react";

const SearchForm = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
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

        await fetchAllProducts();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("/api/seller/filtered-part");
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
      setError(err.response?.data?.message || "حدث خطأ في تحميل المنتجات");
      setResults([]);
      setTotalResults(0);
    }
  };

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

  const handleResetFilters = () => {
    setManufacturer("");
    setModel("");
    setSelectedYear("");
    setCategory("");
    setPart("");
    setCondition("");
    fetchAllProducts();
  };

  const handleManufacturerChange = (value) => {
    setManufacturer(value || "");
    if (value) {
      handleSearch();
    }
  };

  const handleModelChange = (value) => {
    setModel(value || "");
    if (value) {
      handleSearch();
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value || "");
    if (value) {
      handleSearch();
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value || "");
    if (value) {
      handleSearch();
    }
  };

  const handlePartChange = (value) => {
    setPart(value || "");
    if (value) {
      handleSearch();
    }
  };

  const handleConditionChange = (value) => {
    setCondition(value || "");
    if (value) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16 md:pt-20">
        <div
          dir="rtl"
          className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        >
          <div className="relative w-full pt-24 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 to-transparent"></div>
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-5"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  <span className="text-blue-600">ابحث</span> عن قطع غيار
                  <span className="relative whitespace-nowrap">
                    <span className="relative z-10"> مستخدمة</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 418 42"
                      className="absolute top-2/3 left-0 h-[0.6em] w-full fill-blue-300/40"
                      preserveAspectRatio="none"
                    >
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                    </svg>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  اعثر على قطع الغيار المناسبة لسيارتك بأفضل الأسعار وبجودة عالية
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-8 transform transition-all duration-300 hover:shadow-lg border border-gray-100">
              <button
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-4 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200 transition-transform group-hover:scale-110">
                    <Filter className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-base text-gray-700">
                    خيارات الفلترة
                  </span>
                </div>
                <div className="transform transition-transform duration-300">
                  {isFiltersVisible ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isFiltersVisible
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <h2 className="text-lg font-semibold">الفلاتر المتاحة</h2>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Manufacturer Select with Icon */}
                  <div className="space-y-1.5 relative">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Car className="w-4 h-4" />
                      نوع السيارة
                    </label>
                    <Select
                      onValueChange={handleManufacturerChange}
                      value={manufacturer}
                      disabled={loading}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        اختر نوع السيارة
                      </SelectItem>
                      {manufacturers.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    className={`space-y-1.5 transition-all duration-300 ${
                      !manufacturer ? "opacity-50" : ""
                    }`}
                  >
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Tag className="w-4 h-4" />
                      الموديل
                    </label>
                    <Select
                      onValueChange={handleModelChange}
                      value={model}
                      disabled={!manufacturer}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        اختر الموديل
                      </SelectItem>
                      {models.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    className={`space-y-1.5 transition-all duration-300 ${
                      !model ? "opacity-50" : ""
                    }`}
                  >
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4" />
                      السنة
                    </label>
                    <Select
                      onValueChange={handleYearChange}
                      value={selectedYear}
                      disabled={!model || availableYears.length === 0}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        اختر السنة
                      </SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Wrench className="w-4 h-4" />
                      نوع القطعة
                    </label>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={category}
                      disabled={loading}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        اختر النوع
                      </SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div
                    className={`space-y-1.5 transition-all duration-300 ${
                      !category ? "opacity-50" : ""
                    }`}
                  >
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Wrench className="w-4 h-4" />
                      القطعة المطلوبة
                    </label>
                    <Select
                      onValueChange={handlePartChange}
                      value={part}
                      disabled={!category}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        اختر القطعة
                      </SelectItem>
                      {parts.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Tag className="w-4 h-4" />
                      حالة القطعة
                    </label>
                    <Select
                      onValueChange={handleConditionChange}
                      value={condition}
                      className="w-full p-2.5 rounded-lg border text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2 shadow-sm"
                    >
                      <SelectItem disabled value="" className="text-gray-500">
                        حالة الاستخدام
                      </SelectItem>
                      <SelectItem value="مجددة">مجددة</SelectItem>
                      <SelectItem value="مستعملة">مستعملة</SelectItem>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    type="button"
                    onClick={handleSearchClick}
                    disabled={loading}
                    className="w-full sm:w-auto min-w-[180px] py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transform"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                      <>
                        <Search className="w-5 h-5" />
                        بحث
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {error ? (
                <div className="text-center text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="font-medium">خطأ</span>
                  </div>
                  {error}
                </div>
              ) : null}

              {results.length > 0 ? (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
                      <span>تم العثور على {totalResults} منتج</span>
                    </div>
                  </div>
                  <SearchResults results={results} />
                </>
              ) : (
                !loading && (
                  <div className="text-center bg-white p-12 rounded-3xl shadow-lg border border-gray-100">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      لم يتم العثور على أي منتجات
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      يرجى تعديل معايير البحث والمحاولة مرة أخرى، أو تواصل مع فريق
                      الدعم للمساعدة
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchForm;
