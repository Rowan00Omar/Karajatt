// src/components/filters/ConditionFilter.js
import React from "react";
import { useProducts } from "../../context/ProductContext";

const ConditionFilter = () => {
  const { filters, updateFilter } = useProducts();
  const conditions = [
    { value: "مستعمل", label: "مستعمل" },
    { value: "مجدد", label: "مجدد" },
  ];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2 text-right">حالة القطعة</label>
      <select
        value={filters.condition || ""}
        onChange={(e) => updateFilter({ condition: e.target.value || null })}
        className="w-full p-2 border rounded text-right"
      >
        <option value="">جميع الحالات</option>
        {conditions.map((cond) => (
          <option key={cond.value} value={cond.value}>
            {cond.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConditionFilter;
