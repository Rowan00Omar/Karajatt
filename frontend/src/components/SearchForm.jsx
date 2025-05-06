import { useState } from 'react';
import SearchResults from './SearchResults';
const SearchForm = () => {
  const [make, setMake] = useState('اختر نوع السيارة');
  const [model, setModel] = useState('اختر الموديل');
  const [year, setYear] = useState('اختر السنة');
  const [category, setCategory] = useState('تصنيف القطعة');
  const [part, setPart] = useState('اختر القطعة');
  const [results, setResults] = useState([]);
  

  const handleSearch = () => {
    const mockResults = [
        {
          id: 1,
          name: 'كمبروسر مكيف سوناتا ٢٠١٨',
          price: '٢٥٠ ريال',
          image: 'https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=',
          extraImages: [
            'https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI',
            'https://images.automatrix.com/1/99094/86R8oepdERG.JPG',
          ],
          condition: 'جيدة جداً',
          storageDuration: '٦ شهور',
          compatibleModels: 'من ٢٠١٦ إلى ٢٠٢٠',
          seller: 'مؤسسة الحسن لقطع الغيار',
          rating: 4.8,
          reviews: 32,
        },
      ];
    setResults(mockResults);
  };

  return (
    <div dir="rtl" className="w-full p-4 space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-blue-800">البحث عن قطع غيار مستخدمة</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <select
            value={make}
            onChange={e => setMake(e.target.value)}
            className="p-2 border rounded-md bg-blue-50 text-blue-900 min-w-[160px]"
        >
            <option selected disabled>اختر نوع السيارة</option>
            <option>تويوتا</option>
            <option>هوندا</option>
        </select>

        <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="p-2 border rounded-md bg-blue-50 text-blue-900 min-w-[160px]"
        >
            <option disabled selected>اختر الموديل</option>
            <option>كامري</option>
            <option>كورولا</option>
        </select>

        <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="p-2 border rounded-md bg-blue-50 text-blue-900 min-w-[160px]"
        >
            <option disabled selected>اختر السنة</option>
            <option>2020</option>
            <option>2025</option>
        </select>

        <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 border rounded-md bg-blue-50 text-blue-900 min-w-[160px]"
        >
            <option disabled selected>تصنيف القطعة</option>
            <option>كهرباء</option>
            <option>محرك</option>
            <option>هيكل</option>
        </select>

        <select
            value={part}
            onChange={e => setPart(e.target.value)}
            className="p-2 border rounded-md bg-blue-50 text-blue-900 min-w-[160px]"
        >
            <option disabled selected>اختر القطعة</option>
            <option>الدينمو</option>
            <option>بطارية</option>
            <option>رديتر</option>
        </select>

        <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
            بحث
        </button>
        </div>


      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
};

export default SearchForm;
