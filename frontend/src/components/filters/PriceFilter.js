import React from "react";
import { useProducts } from "../../context/ProductContext";

const PriceFilter = () => {
  const { filters, updateFilter } = useProducts();

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2 text-right">
        نطاق السعر (ر.س)
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="الحد الأدنى"
          value={filters.min_price || ""}
          onChange={(e) =>
            updateFilter({
              min_price: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
          className="w-1/2 p-2 border rounded text-right"
          min="0"
        />
        <input
          type="number"
          placeholder="الحد الأقصى"
          value={filters.max_price || ""}
          onChange={(e) =>
            updateFilter({
              max_price: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
          className="w-1/2 p-2 border rounded text-right"
          min="0"
        />
      </div>
    </div>
  );
};

export default PriceFilter;
