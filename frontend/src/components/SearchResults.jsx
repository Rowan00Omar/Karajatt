import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
  return (
    <div className="mt-6 px-4 w-full" dir="rtl">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">نتائج البحث</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map(result => (
          <Link to={`/part/${result.id}`} key={result.id}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition">
              <img src={result.image} alt={result.name} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-blue-900">{result.name}</h3>
                <p className="text-sm text-blue-800">حالة القطعة: <span className="font-medium">{result.condition}</span></p>
                <p className="text-sm text-blue-800">مدة التخزين: <span className="font-medium">{result.storageDuration}</span></p>
                <p className="text-sm text-blue-800">الموديلات الموافقة: <span className="font-medium">{result.compatibleModels}</span></p>
                <p className="text-sm text-gray-600">البائع: {result.seller}</p>
                {/* <p className="text-sm text-gray-600">تفاصيل اخرى: {result.additionaldetails}</p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
