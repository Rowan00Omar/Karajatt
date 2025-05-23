import React from "react";
import { useProducts } from "../../context/ProductContext";

const CarModelFilter = () => {
  const { filters, updateFilter } = useProducts();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      const response = await fetch("/api/cars");
      const data = await response.json();
      setCars(data);
    };
    loadCars();
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">طراز السيارة</label>
      <select
        value={filters.car_id || ""}
        onChange={(e) => updateFilter({ car_id: e.target.value || null })}
        className="w-full p-2 border rounded"
      >
        <option value="">جميع الطرازات</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.company_name} {car.car_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CarModelFilter;
