import { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import { Select, SelectItem } from "./Select";
import Button from "./Button";
import axios from "axios";
import { Search, Filter } from "lucide-react";

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
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="w-full pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">ابحث</span> عن قطع غيار مستخدمة
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اعثر على قطع الغيار المناسبة لسيارتك بأفضل الأسعار وبجودة عالية
            </p>
          </div>

          {/* Search Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-8 text-gray-600">
              <Filter className="w-5 h-5" />
              <h2 className="text-xl font-semibold">فلترة البحث</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Manufacturer Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">نوع السيارة</label>
                <Select
                  onValueChange={setManufacturer}
                  value={manufacturer}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">اختر نوع السيارة</SelectItem>
                  {manufacturers.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Model Select */}
              <div className={`space-y-2 transition-all duration-300 ${!manufacturer ? 'opacity-50' : ''}`}>
                <label className="block text-sm font-medium text-gray-700">الموديل</label>
                <Select
                  onValueChange={setModel}
                  value={model}
                  disabled={!manufacturer}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">اختر الموديل</SelectItem>
                  {models.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Year Select */}
              <div className={`space-y-2 transition-all duration-300 ${!model ? 'opacity-50' : ''}`}>
                <label className="block text-sm font-medium text-gray-700">السنة</label>
                <Select
                  onValueChange={setSelectedYear}
                  value={selectedYear}
                  disabled={!model || availableYears.length === 0}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">اختر السنة</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">نوع القطعة</label>
                <Select
                  onValueChange={setCategory}
                  value={category}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">اختر النوع</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Part Select */}
              <div className={`space-y-2 transition-all duration-300 ${!category ? 'opacity-50' : ''}`}>
                <label className="block text-sm font-medium text-gray-700">القطعة المطلوبة</label>
                <Select
                  onValueChange={setPart}
                  value={part}
                  disabled={!category}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">اختر القطعة</SelectItem>
                  {parts.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Condition Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">حالة القطعة</label>
                <Select
                  onValueChange={setCondition}
                  value={condition}
                  className="w-full p-3 rounded-xl border-2 text-gray-700 border-gray-200 ring-blue-500 transition-all hover:border-blue-400 focus:ring-2"
                >
                  <SelectItem disabled value="">حالة الاستخدام</SelectItem>
                  <SelectItem value="مجددة">مجددة</SelectItem>
                  <SelectItem value="مستعملة">مستعملة</SelectItem>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                onClick={handleSearchClick}
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px] py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          !loading &&
          results !== null && (
            <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لم يتم العثور على أي منتجات
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                يرجى تعديل معايير البحث والمحاولة مرة أخرى، أو تواصل مع فريق الدعم للمساعدة
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchForm;
