import { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import { Select, SelectItem } from "./Select";
import Button from "./Button";
const SearchForm = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [yearRange, setYearRange] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState("");
  const [part, setPart] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState({
    parts: false,
    categories: false,
    category: false,
    models: false,
    years: false,
  });
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
  useEffect(() => {
    const fetchYears = async () => {
      if (!manufacturer || !model) {
        setYearRange(null);
        setAvailableYears([]);
        setSelectedYear("");
        return;
      }

      setLoading((prev) => ({ ...prev, years: true }));

      try {
        const res = await fetch(
          `/api/filtering/years?manufacturer=${encodeURIComponent(
            manufacturer
          )}&model=${encodeURIComponent(model)}`
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        // Assuming your API returns an array, take the first item
        if (data.length > 0) {
          setYearRange(data[0]);

          // Generate years array
          const years = [];
          for (let i = data[0].start_year; i <= data[0].end_year; i++) {
            years.push(i);
          }
          setAvailableYears(years);
        } else {
          setYearRange(null);
          setAvailableYears([]);
        }
      } catch (err) {
        console.error("Failed to fetch years:", err);
        setYearRange(null);
        setAvailableYears([]);
      } finally {
        setLoading((prev) => ({ ...prev, years: false }));
      }
    };

    fetchYears();
  }, [manufacturer, model]); // Depend on both manufacturer and model
  const handleSearch = () => {
    const mockResults = [
      {
        id: 1,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
      {
        id: 2,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
      {
        id: 3,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
      {
        id: 4,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
      {
        id: 5,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
      {
        id: 6,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
        reviews: 32,
      },
      {
        id: 1,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
    ];
    setResults(mockResults);
  };
  const generateYearOptions = () => {
    const years = [];
    if (!yearRange.start_year || !yearRange.end_year) return [];

    for (let i = yearRange.start_year; i <= yearRange.end_year; i++) {
      years.push(i);
    }
    return years;
  };
  return (
    <div dir="rtl" className="w-full pt-24 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-blue-800">
        البحث عن قطع غيار مستخدمة
      </h1>

      <div className="flex flex-row gap-4 justify-center">
        <Select
          onValueChange={setManufacturer}
          value={manufacturer}
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
        {yearRange && availableYears.length > 0 && (
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
            {parts.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </Select>
        )}
        <Select className="text-babyJanaBlue border-babyJanaBlue ring-babyJanaBlue">
          <SelectItem disabled value="">
            اختر الحالة
          </SelectItem>
          <SelectItem>مجددة</SelectItem>
          <SelectItem>مستعملة</SelectItem>
        </Select>

        <Button type="submit" onClick={handleSearch} className="self-center">
          بحث
        </Button>
      </div>

      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
};

export default SearchForm;
